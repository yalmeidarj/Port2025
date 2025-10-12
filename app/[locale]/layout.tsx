import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from "next/font/google"

import { Roboto } from "next/font/google";
import Navigation from '@/components/layout/Navigation';

const font = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // customize as needed
  display: "swap",
  variable: "--font-plus-jakarta", // optional for Tailwind or CSS vars
});


const inter = Inter({ subsets: ["latin"] })
// app/layout.tsx or app/page.tsx
export const metadata: Metadata = {
    title: "Yuri Almeida â€“ Full-Stack Developer & AI Builder",
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
        title: "Yuri Almeida â€“ Full-Stack Developer & AI Builder",
        description:
            "Explore Yuri Almeidaâ€™s portfolio â€” a full-stack dev building performant, elegant web apps and AI tools using the modern web stack.",
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
        title: "Yuri Almeida â€“ Full-Stack Developer & AI Builder",
        description:
            "Toronto-based developer building modern, scalable web apps and AI-powered platforms.",
        images: ["https://yalmeida.vercel.app/logo.png"]
    },
    verification: {
        google: "KbqkE97Ay8oDcA8nCm67gaFp_4iuPsGMkbXC7UA3JhQ",
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
        <html lang={locale} suppressHydrationWarning>
            <body className={font.className}>
                <ThemeProvider 
                    attribute="class" 
                    defaultTheme="dark" 
                    enableSystem 
                    disableTransitionOnChange
                >
                <Toaster position="top-center" richColors />
                    <NextIntlClientProvider>
                        {children}
                        <Navigation />
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

