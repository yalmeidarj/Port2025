import { getTranslations } from "next-intl/server"
import ProjectsTabsClient, { type Project } from "./projects-tabs.client"

const PROJECT_KEYS = ["door-2-door", "tdx", "auto-notifier"] as const

export default async function ProjectsTabs() {
    const t = await getTranslations("projectsCard")

    const projects: Project[] = PROJECT_KEYS.map((key) => {
        const technologiesRaw = t.raw(`${key}.technologies`)
        const technologies = Array.isArray(technologiesRaw) ? technologiesRaw : []

        return {
            id: t(`${key}.id`),
            title: t(`${key}.title`),
            description: t(`${key}.description`),
            image: t(`${key}.image`),
            technologies,
            github: t.raw(`${key}.github`) as string | undefined,
            link: t.raw(`${key}.link`) as string | undefined,
            category: t(`${key}.category`) as Project["category"],
        }
    })

    return <ProjectsTabsClient projects={projects} />
}
