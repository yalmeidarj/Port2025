import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { IoMailOutline } from "react-icons/io5";
import { getTranslations } from "next-intl/server"

export default async function Footer() {
    const t = await getTranslations("footer")

    return (
        <footer className="border-t  py-6">
            <div className="container flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Yuri Almeida. {t("rights")}.
                </p>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Social icon={FaGithub } href="https://github.com/yalmeidarj" />
                    {/* <Social icon={FaLinkedin } href="https://www.linkedin.com/in/yuri-almeida-5b3a5b1b2/" /> */}
                    <Social icon={IoMailOutline } href="mailto:yalmeida@gmail.com" />
                </div>
            </div>
        </footer>
    )
}

function Social({ icon: Icon, href }: { icon: typeof FaGithub; href: string }) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                <Icon className="h-4 w-4" />
                <span className="sr-only">social link</span>
            </Button>
        </Link>
    )
}
