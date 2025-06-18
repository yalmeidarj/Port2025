import { readdir } from "fs/promises";
import path from "path";

export interface PostMeta {
  slug: string;
  title: string;
  publishDate: string;
}

export async function getPosts(locale: string): Promise<PostMeta[]> {
  const root = path.join(process.cwd(), "app", locale, "(blog)");
  const dirs = (await readdir(root, { withFileTypes: true })).filter((d) =>
    d.isDirectory()
  );

  const posts = await Promise.all(
    dirs.map(async ({ name }) => {
      // The dynamic import gives us the `metadata` we exported in the MDX
      const { metadata } = await import(
        `../app/${locale}/(blog)/${name}/${locale}/page.mdx`
      );
      return { slug: name, ...metadata } as PostMeta;
    })
  );

  return posts.sort(
    (a, b) => +new Date(b.publishDate) - +new Date(a.publishDate)
  );
}
