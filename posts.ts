import { readdir } from "fs/promises";
import path from "path";
import { Category } from "./categories";

export interface Post {
  slug: string;
  title: string;
  publishDate: string;
  categories: Category[];
}

export const postsPerPage = 3 as const;

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export async function getSlugs(): Promise<string[]> {
  const dirs = (await readdir(POSTS_DIR, { withFileTypes: true })).filter((d) =>
    d.isDirectory()
  );
  return dirs.map((d) => d.name);
}

async function loadMetadata(locale: string, slug: string) {
  try {
    const mod = await import(`./content/posts/${slug}/${locale}.mdx`);
    return mod.metadata;
  } catch {
    const mod = await import(`./content/posts/${slug}/en.mdx`);
    return mod.metadata;
  }
}

export async function getPosts(locale: string): Promise<Post[]> {
  const slugs = await getSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const metadata = await loadMetadata(locale, slug);
      return { slug, ...metadata } as Post;
    })
  );

  return posts.sort(
    (a, b) => +new Date(b.publishDate) - +new Date(a.publishDate)
  );
}

export async function getPostsByCategory({
  category,
  locale,
}: {
  category: Category;
  locale: string;
}): Promise<Post[]> {
  const allPosts = await getPosts(locale);

  // Filter posts by specified category
  const posts = allPosts.filter(
    (post) => post.categories.indexOf(category) !== -1
  );

  return posts;
}

export async function getPaginatedPosts({
  page,
  limit,
  locale,
}: {
  page: number;
  limit: number;
  locale: string;
}): Promise<{ posts: Post[]; total: number }> {
  const allPosts = await getPosts(locale);

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
  locale,
}: {
  page: number;
  limit: number;
  category: Category;
  locale: string;
}): Promise<{ posts: Post[]; total: number }> {
  const allCategoryPosts = await getPostsByCategory({ locale, category });

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
