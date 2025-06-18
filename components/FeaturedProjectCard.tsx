import Link from "next/link"
import Image from "next/image"
import { Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTranslations } from "next-intl/server"

type Project = {
    id: string
    title: string
    description: string
    image: string
    technologies: string[]
    github: string
    link: string
}
export async function FeaturedProjectCard({ project }: { project: Project }) {
    const t = await getTranslations("projects")
    return (
        <Card className="overflow-hidden group h-full flex flex-col transition-colors duration-300">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
                            <Link href={project.github} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Github className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        {project.link && (
                            <Link href={project.link} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                    <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                            {t("viewDetails")}
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
