import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { FaArrowLeft, FaExternalLinkAlt, FaGithub } from "react-icons/fa"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PROJECTS, getProjectById } from "@/lib/projects"
import { routing } from "@/i18n/routing"

type PageParams = Promise<{
    locale: string
    projectId: string
}>

export async function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        PROJECTS.map((project) => ({
            locale,
            projectId: project.id,
        })),
    )
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
    const { locale, projectId } = await params
    const project = await getProjectById(projectId, locale)

    if (!project) {
        return { title: "Project not found" }
    }

    const title = `${project.title} | Projects`
    const description = project.description

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: project.image ? [{ url: project.image, alt: project.title }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: project.image ? [project.image] : undefined,
        },
    }
}

export default async function ProjectDetailPage({ params }: { params: PageParams }) {
    const { locale, projectId } = await params
    const project = await getProjectById(projectId, locale)
    const tProjects = await getTranslations({ locale, namespace: "projects" })
    const tSections = await getTranslations({ locale, namespace: "sections" })
    const tNav = await getTranslations({ locale, namespace: "nav" })

    if (!project) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            <Header />

            <main className="container py-10 md:py-14">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="sm" className="px-0">
                        <Link href="/#projects" className="flex items-center gap-2">
                            <FaArrowLeft className="h-4 w-4" />
                            <span className="text-sm">{tNav("projects")}</span>
                        </Link>
                    </Button>
                    <Badge variant="secondary" className="uppercase">
                        {project.category}
                    </Badge>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start mt-6">
                    <Card className="overflow-hidden">
                        <div className="relative aspect-[16/9] w-full bg-muted">
                            <Image
                                src={project.image || "/placeholder.svg"}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold leading-tight">{project.title}</h1>
                            <p className="text-sm text-muted-foreground">{tProjects("details")}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {project.github && (
                                <Button asChild variant="outline">
                                    <Link href={project.github} target="_blank" rel="noopener noreferrer">
                                        <FaGithub className="mr-2 h-4 w-4" />
                                        GitHub
                                    </Link>
                                </Button>
                            )}
                            {project.link && (
                                <Button asChild>
                                    <Link href={project.link} target="_blank" rel="noopener noreferrer">
                                        <FaExternalLinkAlt className="mr-2 h-4 w-4" />
                                        Live
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold">{tProjects("details")}</h2>
                                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        {tSections("techStack")}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech) => (
                                            <Badge key={tech} variant="outline" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
