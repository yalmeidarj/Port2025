import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from "next/font/google"


const inter = Inter({ subsets: ["latin"] })
// app/layout.tsx or app/page.tsx
export const metadata: Metadata = {
    title: "Yuri Almeida – Full-Stack Developer & AI Builder",
    description:
        "Yuri Almeida is a full-stack developer based in Toronto, building modern web apps, SaaS platforms, and AI tools with Next.js, Tailwind CSS, Convex, and more.",
    keywords: [
        "Yuri Almeida",
        "Full-Stack Developer",
        "Next.js Developer",
        "Toronto Developer",
        "AI Tools",
        "SaaS Platforms",
        "Convex DB",
        "Tailwind CSS",
        "ShadCN UI",
        "Web Development Portfolio"
    ],
    openGraph: {
        title: "Yuri Almeida – Full-Stack Developer & AI Builder",
        description:
            "Explore Yuri Almeida’s portfolio — a full-stack dev building performant, elegant web apps and AI tools using the modern web stack.",
        url: "https://yalmeida.vercel.app",
        siteName: "Yuri Almeida",
        images: [
            {
                url: "https://yalmeida.vercel.app/logo.png",
                alt: "Yuri Almeida Logo"
            }
        ],
        locale: "en_CA",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Yuri Almeida – Full-Stack Developer & AI Builder",
        description:
            "Toronto-based developer building modern, scalable web apps and AI-powered platforms.",
        images: ["https://yalmeida.vercel.app/logo.png"]
    },
    metadataBase: new URL("https://yalmeida.vercel.app")
};

  

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                <Toaster position="top-center" richColors />
                    <NextIntlClientProvider>{children}</NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}