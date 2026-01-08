import { getTranslations } from "next-intl/server"

export const PROJECTS = [
    { key: "door-2-door", id: "1" },
    { key: "tdx", id: "2" },
    { key: "auto-notifier", id: "3" },
    { key: "match2fan", id: "4" },
] as const

export type ProjectCategory = "web" | "mobile" | "other"

export type Project = {
    id: string
    title: string
    description: string
    image?: string
    technologies: string[]
    github?: string
    link?: string
    category: ProjectCategory
}

type ProjectConfig = (typeof PROJECTS)[number]

export async function getProjects(locale?: string): Promise<Project[]> {
    const t = locale
        ? await getTranslations({ locale, namespace: "projectsCard" })
        : await getTranslations("projectsCard")

    return PROJECTS.map(({ key, id }: ProjectConfig) => {
        const technologiesRaw = t.raw(`${key}.technologies`)
        const technologies = Array.isArray(technologiesRaw) ? technologiesRaw : []

        return {
            id,
            title: t(`${key}.title`),
            description: t(`${key}.description`),
            image: t.raw(`${key}.image`) as string | undefined,
            technologies,
            github: t.raw(`${key}.github`) as string | undefined,
            link: t.raw(`${key}.link`) as string | undefined,
            category: t(`${key}.category`) as ProjectCategory,
        }
    })
}

export async function getProjectById(projectId: string, locale?: string): Promise<Project | null> {
    const projects = await getProjects(locale)
    return projects.find((project) => project.id === projectId) ?? null
}
