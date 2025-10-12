import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/blog";

function getBaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL;

  const normalized =
    envUrl && !envUrl.startsWith("http") ? `https://${envUrl}` : envUrl;

  try {
    return new URL(normalized ?? "https://yalmeida.vercel.app").origin;
  } catch {
    return "https://yalmeida.vercel.app";
  }
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const { locales, defaultLocale } = routing;

  const staticEntries = locales.flatMap((locale) => {
    const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
    const homePath = localePrefix || "/";
    const blogPath = `${localePrefix}/blog` || "/blog";
    const lastModified = new Date();

    return [
      {
        url: `${baseUrl}${homePath}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: locale === defaultLocale ? 1 : 0.9,
      },
      {
        url: `${baseUrl}${blogPath}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ];
  });

  const blogEntries = (
    await Promise.all(
      locales.map(async (locale) => {
        const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
        const posts = await getBlogPosts(locale);

        return posts.map((post) => {
          const lastModified =
            parseDate(post.metadata.publishedTime) ??
            parseDate(post.metadata.openGraph["og:updated_time"]) ??
            parseDate(post.date) ??
            new Date();

          return {
            url: `${baseUrl}${localePrefix}/blog/${post.slug}`,
            lastModified,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          };
        });
      })
    )
  ).flat();

  return [...staticEntries, ...blogEntries];
}

