import { MetadataRoute } from "next";

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

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/_next", "/trpc"],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  };
}

