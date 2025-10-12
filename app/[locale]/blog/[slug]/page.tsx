// app/[locale]/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { routing } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { renderHtmlToReact } from "./render-html";

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

  const description = post.metadata.description ?? post.excerpt;
  const title = post.metadata.title ?? post.title;

  const openGraphTitle =
    post.metadata.openGraph["og:title"] ?? post.metadata.title ?? post.title;
  const openGraphDescription =
    post.metadata.openGraph["og:description"] ?? description;

  const rawOpenGraphType = post.metadata.openGraph["og:type"];
  const openGraphType = rawOpenGraphType?.toLowerCase() === "website" ? "website" : "article";

  const baseOpenGraph = {
    title: openGraphTitle,
    description: openGraphDescription,
    ...(post.metadata.openGraph["og:url"]
      ? { url: post.metadata.openGraph["og:url"] }
      : {}),
  };

  const openGraph =
    openGraphType === "article"
      ? ({
          ...baseOpenGraph,
          type: "article",
          publishedTime: post.metadata.publishedTime,
          authors: post.metadata.author ? [post.metadata.author] : undefined,
          tags: post.metadata.tags.length > 0 ? post.metadata.tags : undefined,
        } satisfies NonNullable<Metadata["openGraph"]>)
      : ({
          ...baseOpenGraph,
          type: "website",
        } satisfies NonNullable<Metadata["openGraph"]>);

  const twitterMetadata: NonNullable<Metadata["twitter"]> | undefined =
    Object.keys(post.metadata.twitter).length > 0
      ? {
          card: (post.metadata.twitter["twitter:card"] as any) ?? "summary_large_image",
          title:
            post.metadata.twitter["twitter:title"] ??
            post.metadata.openGraph["og:title"] ??
            title,
          description:
            post.metadata.twitter["twitter:description"] ??
            openGraphDescription,
        }
      : undefined;

  return {
    title: `${title} | Blog`,
    description,
    authors: post.metadata.author ? [{ name: post.metadata.author }] : undefined,
    openGraph,
    twitter: twitterMetadata,
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

      <main className="container  py-8">
        <div className=" mx-auto">
          <article className="prose prose-lg max-w-none text-accent-foreground">
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
            <div className="prose-content">
              {renderHtmlToReact(post!.content, { lang: post!.locale ?? locale })}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}


