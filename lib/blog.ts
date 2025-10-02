import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  locale: string;
}

export async function getBlogPosts(locale: string = "en"): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), "public", "blog", locale, "posts");

  try {
    const files = fs.readdirSync(blogDir);
    const htmlFiles = files.filter(file => file.endsWith(".html"));

    const posts: BlogPost[] = [];

    for (const file of htmlFiles) {
      const slug = file.replace(".html", "");
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, " ");

      const excerptMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i);
      const excerpt = excerptMatch ? excerptMatch[1].substring(0, 150) + "..." : content.substring(0, 150) + "...";

      const dateMatch = content.match(/<meta name="date" content="([^"]+)"/i);
      const date = dateMatch ? dateMatch[1] : "2025-01-01";

      posts.push({
        slug,
        title,
        excerpt,
        date,
        author: "Yuri Almeida",
        tags: [],
        content,
        locale
      });
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}
