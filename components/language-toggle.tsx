"use client"
import { Languages } from "lucide-react"
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


/* -------------------------------------------------------------------------- */
/* Shared i18n constants – exactly the same list used in i18n-config.ts       */
/* -------------------------------------------------------------------------- */
const LANGS = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
] as const;

type Lang = (typeof LANGS)[number];

/* -------------------------------------------------------------------------- */

interface Props {
    isScrolled: boolean;          // keeps your header styling intact
}

export function LanguageToggle({ isScrolled }: Props) {
    const router = useRouter();
    const pathname = usePathname();      // e.g. /fr/services or /en
    const dropdown = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    /* Figure out which locale is active from the first path segment */
    const current: Lang = useMemo(() => {
        if (!mounted) return LANGS[0]; // Default to first language during SSR
        const seg = pathname.split('/')[1];          // '' | 'en' | 'fr' …
        return LANGS.find((l) => l.code === seg) ?? LANGS[0];
    }, [pathname, mounted]);

    function changeLanguage(lang: Lang) {
        if (lang.code === current.code) {
            setOpen(false);
            return;
        }

        // 1. Persist visitor choice for middleware (1 year)
        document.cookie = `tdx_locale=${lang.code};path=/;max-age=31536000`;

        // 2. Compute the same path but under the new locale
        //    Strip the current locale prefix (if any) and prepend the new one.
        const [, , ...rest] = pathname.split('/');           // drop '' and locale
        const newPath = `/${lang.code}/${rest.join('/')}`.replace(/\/+$/, ''); // rm trailing /

        router.push(newPath || `/${lang.code}`);
        setOpen(false);
    }

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <Languages className="h-4 w-4" />
                <span className="sr-only">Switch language</span>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Languages className="h-4 w-4" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {LANGS.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang)}
                        className={`flex items-center gap-2 ${lang.code === current.code ? 'font-bold' : ''}`}
                    >
                        <span>{lang.flag}</span>
                        {lang.name}
                    </DropdownMenuItem>
                ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
