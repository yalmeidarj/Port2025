import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { getTranslations } from "next-intl/server"
import { TextEffect } from "../ui/text-effect"
import { TextScramble } from "../ui/text-scramble"
import { TextLoop } from "../ui/text-loop"

export default async function Header() {
    const t = await getTranslations("nav")

    return (
        <header className=" top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">Yuri Almeida</span>
                </Link>

                {/* Desktop menu */}
 

                {/* Controls */}
                <div className="flex items-center w-full max-w-xs justify-end space-x-1 sm:space-x-2">
                     {/* Full-Stack Software Engineer */}
                     {/* <TextScramble className='font-mono text-sm uppercase'>
                     Full-Stack Developer
                        </TextScramble> */}
                        <TextLoop className='font-mono text-sm uppercas text-end w-full'>
                            <span className="uppercase">Web Developement</span>
                            <span className="uppercase">Mobile Apps</span>
                            <span className="uppercase">UI/UX Design</span>
                            <span className="uppercase">Software Engineer</span>
                            <span className="uppercase">Full-Stack Developer</span>
                            <span className="uppercase">Problem Solver</span>
                            <span className="uppercase">Artificial Intelligence</span>
                            <span className="uppercase">Open Source</span>
                            <span className="uppercase">Automation </span>
                        </TextLoop>
                    {/* <div className="w-px h-6 bg-border mx-2" /> */}

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
