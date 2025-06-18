import ContactForm from "@/components/contact-form"
import { Mail, Linkedin, Github } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Posts } from "../posts/Posts"
import { Pagination } from "../posts/Pagination"
import { getPaginatedPosts, postsPerPage } from "@/posts"

export async function ContactSection() {
    const t = await getTranslations("contact")
    const { posts, total } = await getPaginatedPosts({ page: 1, limit: postsPerPage });
    return (
        <section id="contact" className="container py-12">
            <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p>{t("description")}</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary" />
                            <a href="mailto:yalmeida@gmail.com" className="hover:text-primary transition-colors">
                                yalmeida@gmail.com
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Linkedin className="h-5 w-5 text-primary" />
                            <a
                                href="https://www.linkedin.com/in/yuri-almeida-5b3a5b1b2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                            >
                                linkedin.com/in/yuri-almeida
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Github className="h-5 w-5 text-primary" />
                            <a
                                href="https://github.com/yalmeidarj"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                            >
                                github.com/yalmeida-hotmart
                            </a>
                        </div>
                    </div>
                </div>
                <div className="">
                    <Posts posts={posts} />

                    <Pagination baseUrl="/page" page={1} perPage={postsPerPage} total={total} />
                    </div>
                <div>
                    <ContactForm
                        placeholders={{
                            first: t('name'),
                            // last: t('form.last'),
                            email: t('email'),
                            message: t('message'),
                            subject: t('subject'),
                            send: t('send'),
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
