import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { routing } from "@/i18n/routing";

export const revalidate = 60;
export const dynamic = 'force-static';
// GET /api/blog/[slug] - Get a specific blog post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams, pathname } = new URL(req.url);
    let locale = searchParams.get('locale');
    if (!locale) {
      // Try to extract locale from the URL path (e.g., /es/blog/slug)
      // Supported locales from routing.locales
      const supportedLocales = routing.locales;
      // Split pathname and find the first segment that matches a supported locale
      const segments = pathname.split('/').filter(Boolean);
  const foundLocale = segments.find(seg => supportedLocales.includes(seg as typeof routing.locales[number]));
      locale = foundLocale || routing.defaultLocale;
    }
    const filePath = path.join(process.cwd(), "public", "blog", locale, "posts", `${slug}.html`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Extract metadata from HTML
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, " ");
    
    const excerptMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i);
    const excerpt = excerptMatch ? excerptMatch[1].substring(0, 150) + "..." : content.substring(0, 150) + "...";
    
    // Extract date from HTML meta tag or use default
    const dateMatch = content.match(/<meta name="date" content="([^"]+)"/i);
    const date = dateMatch ? dateMatch[1] : "2025-01-01"; // Default date for consistency
    
    return NextResponse.json({
      slug,
      title,
      excerpt,
      date,
      author: "Yuri Almeida",
      tags: [],
      content,
      locale
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}