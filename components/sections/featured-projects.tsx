import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"

export interface Project {
    id: string
    title: string
    description: string
    image?: string
    technologies: string[]
    github?: string
    link?: string
}

export default async function FeaturedProjects({ projects }: { projects: Project[] }) {
    const t = await getTranslations("sections")
    const tp = await getTranslations("projects") // project-specific copy

    return (
        <section id="featured-projects" className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("featuredProjects")}</h2>
                <Link href="#projects" className="text-sm text-primary hover:underline">
                    {t("viewAll")}
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden group h-full flex flex-col transition-colors">
                        <div className="relative h-48 w-full">
                            <Image
                                src={project.image || "/placeholder.svg"}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                            <div className="space-y-2 flex-1">
                                <h3 className="font-semibold text-lg">{project.title}</h3>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {project.technologies.slice(0, 3).map((tech) => (
                                    <Badge key={tech} variant="outline" className="text-xs">
                                        {tech}
                                    </Badge>
                                ))}
                                {project.technologies.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{project.technologies.length - 3}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                <div className="flex gap-2">
                                    {project.github && (
                                        <IconLink href={project.github} icon={Github} sr="GitHub" />
                                    )}
                                    {project.link && (
                                        <IconLink href={project.link} icon={ExternalLink} sr="Visit" />
                                    )}
                                </div>

                                <Link href={`/projects/${project.id}`}>
                                    <Button variant="outline" size="sm">
                                        {tp("viewDetails")}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}

function IconLink({
    href,
    icon: Icon,
    sr,
}: {
    href: string
    icon: typeof Github
    sr: string
}) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon className="h-4 w-4" />
                <span className="sr-only">{sr}</span>
            </Button>
        </Link>
    )
}
