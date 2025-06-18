import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function Hero() {
    const t = await getTranslations("hero")

    return (
        <section className="container py-8">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-8 max-w-4xl mx-auto transition-colors duration-300">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 flex-shrink-0">
                        <Image src="/placeholder.svg?height=128&width=128" alt="Yuri Almeida" fill className="object-cover" priority />
                    </div>

                    <div className="space-y-4 text-center md:text-left">
                        <div>
                            <h1 className="text-2xl font-bold">Yuri Almeida</h1>
                            <p className="text-muted-foreground">{t("jobTitle")}</p>
                        </div>

                        <p className="text-foreground">
                            {t("greeting")}{" "}
                            <Link href="#contact" className="text-primary hover:underline">
                                {t("getInTouch")}
                            </Link>
                            !
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
