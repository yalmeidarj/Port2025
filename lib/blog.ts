import fs from "fs";
import path from "path";
import { parse, HTMLElement } from "node-html-parser";

export interface BlogPostMetadata {
  title?: string;
  description?: string;
  author?: string;
  publishedTime?: string;
  tags: string[];
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  locale: string;
  metadata: BlogPostMetadata;
}

export function extractBlogMetadata(html: string): BlogPostMetadata {
  const root = parse(html);
  const head = root.querySelector("head");

  const metadata: BlogPostMetadata = {
    title: undefined,
    description: undefined,
    author: undefined,
    publishedTime: undefined,
    tags: [],
    openGraph: {},
    twitter: {},
  };

  if (head) {
    const titleTag = head.querySelector("title");
    if (titleTag) {
      metadata.title = titleTag.text.trim();
    }

    const metaTags = head.querySelectorAll("meta");

    metaTags.forEach((metaTag: HTMLElement) => {
      const nameAttr = metaTag.getAttribute("name");
      const propertyAttr = metaTag.getAttribute("property");
      const content = metaTag.getAttribute("content") ?? metaTag.getAttribute("value") ?? "";
      const value = content.trim();

      if (!value) return;

      const key = (nameAttr ?? propertyAttr ?? "").toLowerCase();
      if (!key) return;

      switch (key) {
        case "description":
          metadata.description = value;
          break;
        case "author":
          metadata.author = value;
          break;
        case "date":
          if (!metadata.publishedTime) {
            metadata.publishedTime = value;
          }
          break;
        case "keywords":
          metadata.tags.push(
            ...value
              .split(",")
              .map((token) => token.trim())
              .filter(Boolean)
          );
          break;
        default:
          if (key === "article:author" && !metadata.author) {
            metadata.author = value;
          }

          if ((key === "article:published_time" || key === "article:modified_time") && !metadata.publishedTime) {
            metadata.publishedTime = value;
          }

          if (key === "article:tag") {
            metadata.tags.push(value);
          }

          if (key.startsWith("og:")) {
            metadata.openGraph[key] = value;
          }

          if (key.startsWith("twitter:")) {
            metadata.twitter[key] = value;
          }
          break;
      }
    });
  }

  metadata.tags = Array.from(new Set(metadata.tags.map((tag) => tag.trim()).filter(Boolean)));

  return metadata;
}

export function extractExcerpt(html: string): string {
  const root = parse(html);
  const body = root.querySelector("body") ?? root;
  const firstParagraph = body.querySelector("p");
  const text = firstParagraph?.text?.trim() ?? body.text.trim();

  if (!text) return "";

  if (text.length <= 150) return text;

  return `${text.slice(0, 150)}...`;
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

      const metadata = extractBlogMetadata(content);

      const fallbackTitle = slug.replace(/-/g, " ");
      const title = metadata.title ?? fallbackTitle;

      const excerpt = metadata.description ?? extractExcerpt(content) ?? "";

      const date = metadata.publishedTime ?? "2025-01-01";

      const author = metadata.author ?? "Yuri Almeida";

      const tags = metadata.tags.length > 0 ? metadata.tags : [];

      posts.push({
        slug,
        title,
        excerpt,
        date,
        author,
        tags,
        content,
        locale,
        metadata,
      });
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}
