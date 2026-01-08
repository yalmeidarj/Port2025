import { getProjects } from "@/lib/projects"
import ProjectsTabsClient from "./projects-tabs.client"

export default async function ProjectsTabs() {
    const projects = await getProjects()

    return <ProjectsTabsClient projects={projects} />
}
