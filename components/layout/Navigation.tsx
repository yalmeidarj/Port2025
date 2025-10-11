import Link from "next/link";
import type { ReactNode } from "react";
import { FaHome, FaRegFolderOpen } from "react-icons/fa";
import { FaBlog } from "react-icons/fa";
import { FaGithubAlt } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FaMailBulk } from "react-icons/fa";
import { ThemeToggle } from "../theme-toggle";
import { LanguageToggle } from "../language-toggle";


export default function Navigation() {
    return (
        <nav
            aria-label="Main navigation"
            className="w-full "
        >
            <div className="border border-ring rounded-xl bg-background/95 backdrop-blur shadow-lg supports-[backdrop-filter]:bg-background/60  flex fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transform">
            <NavItem icon={<FaHome />} label="Home" link="/" />
            <NavItem icon={<FaRegFolderOpen />} label="Projects" link="/#projects" />
            <NavItem icon={<FaBlog />} label="Blog" link="/blog" />
            <NavItem icon={<FaGithubAlt />} label="GitHub" newTab link="https://github.com/yalmeidarj" />
            {/* <NavItem icon={<FaDiscord />} label="Discord" link="#" /> */}
            <NavItem icon={<FaMailBulk />} label="Email" link="/#contact" />
            <div className="flex items-center border-l border-border pl-2 ml-2">

            <ThemeToggle  />
            <LanguageToggle isScrolled={false} />
            </div>
            </div>
        </nav>
    );
}

type NavItemProps = {
    icon: ReactNode;
    label: string;
    link: string;
    newTab?: boolean;
};

function NavItem({ icon, label, link, newTab=false }: NavItemProps) {
    return (        
            <Link
            target={newTab ? "_blank" : undefined}
        className="group flex items-center gap-2   px-4 py-3 text-sm font-medium  transition-all duration-300 group-hover:gap-2 group-hover:px-6"
                href={link}>
            <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                {icon}
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 ease-out group-hover:max-w-[140px] group-hover:opacity-100">
                {label}
            </span>
            </Link>
        
    );
}
