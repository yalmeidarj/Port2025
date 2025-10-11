"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"

export type Project = {
    id: string
    title: string
    description: string
    image?: string
    technologies: string[]
    github?: string
    link?: string
    category: "web" | "mobile" | "other"
}

type ProjectsTabsClientProps = {
    projects: Project[]
}

export default function ProjectsTabsClient({ projects }: ProjectsTabsClientProps) {
    const tp = useTranslations("projects")
    const [filter, setFilter] = useState<"all" | "web" | "mobile" | "other">("all")

    const filtered =
        filter === "all" ? projects : projects.filter((p) => p.category === filter)

    return (
        <section id="projects" className="bg-muted/40 py-12">
            <div className="container">
                <h2 className="text-2xl font-bold mb-6">{tp("allProjects")}</h2>

                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="all">{tp("all")}</TabsTrigger>
                        <TabsTrigger value="web">{tp("web")}</TabsTrigger>
                        <TabsTrigger value="mobile">{tp("mobile")}</TabsTrigger>
                        <TabsTrigger value="other">{tp("other")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value={filter} className="space-y-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

function ProjectCard({ project }: { project: Project }) {
    const t = useTranslations("projects")

    return (
        <Card className="overflow-hidden group h-full flex flex-col transition-colors">
            <div className="relative h-40 w-full">
                <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {project.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 2).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                        </Badge>
                    ))}
                    {project.technologies.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 2}
                        </Badge>
                    )}
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-1">
                        {project.github && (
                            <IconLink href={project.github} icon={FaGithub} sr="GitHub" />
                        )}
                        {project.link && (
                            <IconLink href={project.link} icon={FaExternalLinkAlt} sr="Visit" />
                        )}
                    </div>

                    <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                            {t("details")}
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

function IconLink({
    href,
    icon: Icon,
    sr,
}: {
    href: string
    icon: typeof FaGithub
    sr: string
}) {
    return (
        <Link href={href} target="_blank">
            <Button variant="ghost" size="icon" className="cursor-pointer h-6 w-6">
                <Icon className="h-3 w-3" />
                <span className="sr-only">{sr}</span>
            </Button>
        </Link>
    )
}
