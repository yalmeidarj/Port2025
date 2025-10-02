import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the blog post type
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  locale: string;
}

// Function to read blog posts from public directory for a specific locale
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
      
      // Extract metadata from HTML comments or use defaults
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, " ");
      
      // Extract excerpt from first paragraph or use first 150 chars
      const excerptMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i);
      const excerpt = excerptMatch ? excerptMatch[1].substring(0, 150) + "..." : content.substring(0, 150) + "...";
      
      // Extract date from HTML meta tag or use file modification time
      const dateMatch = content.match(/<meta name="date" content="([^"]+)"/i);
      const date = dateMatch ? dateMatch[1] : "2025-01-01"; // Default date for consistency
      
      posts.push({
        slug,
        title,
        excerpt,
        date,
        author: "Yuri Almeida", // You can extract from HTML if needed
        tags: [], // You can extract from HTML if needed
        content,
        locale
      });
    }
    
    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

// GET /api/blog - Get all blog posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';
    
    const posts = await getBlogPosts(locale);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
