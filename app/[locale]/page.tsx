import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { ContactSection } from "@/components/sections/contact"
import Hero from "@/components/sections/hero"
import ProjectsTabs from "@/components/sections/projects-tabs"
import TechStack from "@/components/sections/tech-stack"

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background  transition-colors duration-300 overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
            <Header />
            <Hero />
            <TechStack />
            <ProjectsTabs />

            <ContactSection />
            <Footer />
        </div>
    )
}
