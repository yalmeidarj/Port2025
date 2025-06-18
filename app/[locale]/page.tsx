// import { Hero } from "@/components/sections/hero"
// import { Header } from "@/components/layout/header"
// import RecentPosts from "@/components/sections/recent-posts"
// import { FeaturedProjects } from "@/components/sections/featured-projects"
// import { TechStack } from "@/components/sections/tech-stack"
// import { ProjectsTabs } from "@/components/sections/projects-tabs"
// import { ContactSection } from "@/components/sections/contact"
// import { Footer } from "@/components/layout/footer"

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ContactSection } from "@/components/sections/contact";
import FeaturedProjects from "@/components/sections/featured-projects";
import Hero from "@/components/sections/hero";
import ProjectsTabs from "@/components/sections/projects-tabs";
import RecentPosts from "@/components/sections/recent-posts";
import TechStack from "@/components/sections/tech-stack";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            <Header />
            
            <RecentPosts
                posts={[
                    {
                        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                        slug: "lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-elit",
                        date: "May 10, 2023",
                        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                        tags: ["Next.js", "React", "JavaScript"],
                    }
                ]}
            />
            <FeaturedProjects
                projects={[
                    {
                        id: "1",
                        title: "E-commerce Platform",
                        description: "A full-featured e-commerce platform with product management, cart, and checkout functionality.",
                        image: "/project-one.jpg",
                        technologies: ["Next.js", "React", "Tailwind CSS"],
                        github: "https://github.com/yalmeida-hotmart/project-one",
                        link: "https://project-one.com",
                        // category: "web",
                    }]
                }
            />
            <TechStack />
            <ProjectsTabs projects={[]} />
            <Hero />
            <ContactSection />
            <Footer />
        </div>
    );
}

// In case of async components, you can use the
//  awaitable getTranslations function instead:

// import { getTranslations } from 'next-intl/server';

// export default async function HomePage() {
//     const t = await getTranslations('HomePage');
//     return <h1>{t('title')}</h1>;
// }