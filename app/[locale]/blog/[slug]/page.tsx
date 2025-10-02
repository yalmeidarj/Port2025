// app/[locale]/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { routing } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/blog";

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

// Optionally set route-level revalidation (instead of per-fetch)
export const revalidate = 60; // seconds (ISR). Page/data revalidates at most every 60s. :contentReference[oaicite:1]{index=1}

async function getBlogPost(slug: string, locale: string): Promise<BlogPost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog/${slug}?locale=${locale}`, {
      // Use ISR via Next data cache
      next: { revalidate: 60 }, // can omit if using route-level revalidate above
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params; // <- await params (Next.js v15+)
  const post = await getBlogPost(slug, locale);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const entries = await Promise.all(
    routing.locales.map(async (locale) => {
      const posts = await getBlogPosts(locale);
      return posts.map((post) => ({ locale, slug: post.slug }));
    })
  );

  return entries.flat();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params; // <- await params (Next.js v15+)
  const post = await getBlogPost(slug, locale);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post!.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>{post!.author}</span>
                <span>•</span>
                <time dateTime={post!.date}>
                  {new Date(post!.date).toLocaleDateString(post!.locale ?? locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post!.content }}
            />
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}