import { readdir } from "fs/promises";
import { Category } from "./categories";

export interface Post {
  slug: string;
  title: string;
  publishDate: string;
  categories: Category[];
}

export const postsPerPage = 3 as const;

export async function getPosts(): Promise<Post[]> {
  // Retreive slugs from post routes
  const slugsEN = (
    await readdir("./app/[locale]/blog/[slug]/(en)", { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory());
  const slugsES = (
    await readdir("./app/[locale]/blog/[slug]/(es)", { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory());
  const slugsPT = (
    await readdir("./app/[locale]/blog/[slug]/(pt-br)", { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory());

    // Combine slugs from all locales
    const slugs = [...slugsEN, ...slugsES, ...slugsPT].map((dirent) => ({
      name: dirent.name,
    }));
  // // Retreive metadata from MDX files
  const postsEN = await Promise.all(
    slugsEN.map(async ({ name }) => {
      const { metadata } = await import(
        `./app/[locale]/blog/[slug]/(en)/${name}/page.mdx`
      );
      return { slug: name, ...metadata };
    })
  );

  const postsES = await Promise.all(
    slugs.map(async ({ name }) => {
      const { metadata } = await import(
        `./app/[locale]/blog/[slug]/(es)/${name}/page.mdx`
      );
      return { slug: name, ...metadata };
    })
  );
  const postsPT = await Promise.all(
    slugs.map(async ({ name }) => {
      const { metadata } = await import(`./app/[locale]/blog/[slug]/(pt-br)/${name}/page.mdx`)
      return { slug: name, ...metadata };
    })
  );

  // Combine posts from all locales
  const posts = [...postsEN, ...postsES, ...postsPT] as Post[];

  // Sort posts from newest to oldest
  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return posts;
}

export async function getPostsByCategory({
  category,
}: {
  category: Category;
}): Promise<Post[]> {
  const allPosts = await getPosts();

  // Filter posts by specified category
  const posts = allPosts.filter(
    (post) => post.categories.indexOf(category) !== -1
  );

  return posts;
}

export async function getPaginatedPosts({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<{ posts: Post[]; total: number }> {
  const allPosts = await getPosts();

  // Get a subset of posts pased on page and limit
  const paginatedPosts = allPosts.slice((page - 1) * limit, page * limit);

  return {
    posts: paginatedPosts,
    total: allPosts.length,
  };
}

export async function getPaginatedPostsByCategory({
  page,
  limit,
  category,
}: {
  page: number;
  limit: number;
  category: Category;
}): Promise<{ posts: Post[]; total: number }> {
  const allCategoryPosts = await getPostsByCategory({ category });

  // Get a subset of posts pased on page and limit
  const paginatedCategoryPosts = allCategoryPosts.slice(
    (page - 1) * limit,
    page * limit
  );

  return {
    posts: paginatedCategoryPosts,
    total: allCategoryPosts.length,
  };
}
