import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"

export default async function Footer() {
    const t = await getTranslations("footer")

    return (
        <footer className="border-t py-6">
            <div className="container flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Yuri Almeida. {t("rights")}.
                </p>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Social icon={Github} href="https://github.com/yalmeida-hotmart" />
                    <Social icon={Linkedin} href="https://www.linkedin.com/in/yuri-almeida-5b3a5b1b2/" />
                    <Social icon={Mail} href="mailto:yuri.almeida@hotmart.com" />
                </div>
            </div>
        </footer>
    )
}

function Social({ icon: Icon, href }: { icon: typeof Github; href: string }) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon className="h-4 w-4" />
                <span className="sr-only">social link</span>
            </Button>
        </Link>
    )
}
