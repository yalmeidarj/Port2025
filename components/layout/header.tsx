import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { getTranslations } from "next-intl/server"

export default async function Header() {
    const t = await getTranslations("nav")

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">Yuri Almeida</span>
                </Link>

                {/* Desktop menu */}
                <nav className="hidden md:flex gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">{t("home")}</Link>
                    <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">{t("about")}</Link>
                    <Link href="#projects" className="text-sm font-medium hover:text-primary transition-colors">{t("projects")}</Link>
                    <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">Blog</Link>
                    <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">{t("contact")}</Link>
                </nav>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <LanguageToggle isScrolled={false} />
                    <div className="w-px h-6 bg-border mx-2" />

                    <Social icon={Github} href="https://github.com/yalmeida-hotmart" />
                    <Social icon={Linkedin} href="https://www.linkedin.com/in/yuri-almeida-5b3a5b1b2/" />
                    <Social icon={Mail} href="mailto:yuri.almeida@hotmart.com" />
                </div>
            </div>
        </header>
    )
}

function Social({ icon: Icon, href }: { icon: typeof Github; href: string }) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <Icon className="h-4 w-4" />
                <span className="sr-only">social link</span>
            </Button>
        </Link>
    )
}
