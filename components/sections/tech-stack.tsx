// import { Card } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import TechCard from "../tech-card"

export default async function TechStack() {
    const t = await getTranslations()

    return (
        <section id="tech-stack" className="container py-12">
            <h2 className="text-2xl font-bold mb-8">{t("sections.techStack")}</h2>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Front-end */}
                <StackGroup title={t("tech.frontend")}>
                    <TechCard name="React" icon={<span className="text-[#61DAFB]">⚛️</span>} />
                    <TechCard name="Next.js" icon={<span>⬛</span>} />
                    <TechCard name="TypeScript" icon={<span className="text-[#3178C6]">TS</span>} />
                    <TechCard name="Tailwind" icon={<span className="text-[#38B2AC]">🌊</span>} />
                </StackGroup>

                {/* Back-end */}
                <StackGroup title={t("tech.backend")}>
                    <TechCard name="Node.js" icon={<span className="text-[#339933]">🟢</span>} />
                    <TechCard name="Express" icon={<span>🚂</span>} />
                    <TechCard name="MongoDB" icon={<span className="text-[#47A248]">🍃</span>} />
                    <TechCard name="PostgreSQL" icon={<span className="text-[#336791]">🐘</span>} />
                </StackGroup>
            </div>
        </section>
    )
}

function StackGroup({ title, children }: React.PropsWithChildren<{ title: string }>) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{children}</div>
        </div>
    )
}
