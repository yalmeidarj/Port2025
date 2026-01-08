import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function Hero() {
    const t = await getTranslations("hero")

    return (
        <section className="container py-8">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-8  mx-auto transition-colors duration-300">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="relative w-32 h-32 bg-primary drop-shadow-ring shadow-md rounded-full overflow-hidden border-4 border-primary/20 flex-shrink-0">
                        <Image className=" object-cover bg-transparent" src="https://port2025.b-cdn.net/Portfolio/Myself/Untitled%20design%20(3).png" alt="Yuri Almeida" fill priority />
                    </div>

                    <div className="space-y-4 text-center md:text-left">
                        <div>
                            <h1 className="text-2xl font-bold">Yuri Almeida</h1>
                            <p className="text-muted-foreground">{t("jobTitle")}</p>
                        </div>

                        <p className="text-foreground text-start">
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
