import Link from "next/link"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"

export interface Post {
    title: string
    slug: string
    date: string
    excerpt: string
    tags: string[]
}

export default async function RecentPosts({ posts }: { posts: Post[] }) {
    const t = await getTranslations("sections")

    return (
        <section className="container py-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("recentPosts")}</h2>
                <Link href="/blog" className="text-sm text-primary hover:underline">
                    {t("viewAll")}
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post) => (
                    <Card key={post.slug} className="overflow-hidden group transition-colors duration-300">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{post.date}</span>
                            </div>

                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h3>

                            <p className="text-sm text-muted-foreground">{post.excerpt}</p>

                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
