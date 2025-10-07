import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { routing } from "@/i18n/routing";
import { extractBlogMetadata, extractExcerpt } from "@/lib/blog";

export const revalidate = 60;
export const dynamic = 'force-dynamic';
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

    const metadata = extractBlogMetadata(content);

    const fallbackTitle = slug.replace(/-/g, " ");
    const title = metadata.title ?? fallbackTitle;
    const excerpt = metadata.description ?? extractExcerpt(content);
    const date = metadata.publishedTime ?? "2025-01-01"; // Default date for consistency
    const author = metadata.author ?? "Yuri Almeida";
    const tags = metadata.tags.length > 0 ? metadata.tags : [];

    return NextResponse.json({
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
