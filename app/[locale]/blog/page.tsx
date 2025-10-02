import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { routing } from "@/i18n/routing";

export const revalidate = 60;

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  locale: string;
}

async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog?locale=${locale}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
}

export const metadata: Metadata = {
  title: "Blog | Yuri Almeida",
  description: "Read my latest thoughts on web development, technology, and more.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const posts = await getBlogPosts(locale);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No blog posts available yet.</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.slug} className="border-b border-border pb-8">
                  <h2 className="text-2xl font-semibold mb-2">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>{post.author}</span>
                    <span>•</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
