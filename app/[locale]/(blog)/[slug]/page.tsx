import { useMDXComponents } from '@/mdx-components';
import { getSlugs } from '@/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const LOCALES = ['en', 'es', 'pt-BR'] as const;

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.flatMap((slug) =>
    LOCALES.map((locale) => ({ locale, slug }))
  );
}

async function loadPost(locale: string, slug: string) {
  try {
    return await import(`../../../../content/posts/${slug}/${locale}.mdx`);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const mod = await loadPost(params.locale, params.slug);
  if (!mod) return {};
  return {
    title: mod.metadata.title,
    description: mod.metadata.description,
    alternates: {
      canonical: `/${params.locale}/${params.slug}`,
      languages: {
        en: `/en/${params.slug}`,
        es: `/es/${params.slug}`,
        'pt-BR': `/pt-BR/${params.slug}`,
      },
    },
  };
}

export default async function PostPage({ params }: { params: { locale: string; slug: string } }) {
  const mod = await loadPost(params.locale, params.slug);
  if (!mod) {
    notFound();
  }
  const { default: Content, metadata } = mod!;
  const MDXComponents = useMDXComponents({});
  return (
    <article className="prose mx-auto py-10">
      <h1>{metadata.title}</h1>
      <Content components={MDXComponents} />
    </article>
  );
}
