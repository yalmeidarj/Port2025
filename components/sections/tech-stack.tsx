import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import TechCard from "../tech-card"
// import { InfiniteSlider }
import {RiNextjsFill} from "react-icons/ri"
import { SiMongodb } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { SiTypescript } from "react-icons/si";
import { FaDocker } from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";
import { FaPython } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { FaGithub } from "react-icons/fa";
import { FaAws } from "react-icons/fa";
import { FaLinux } from "react-icons/fa";
import { InfiniteSlider } from "../ui/infinite-slider";
import { IoLogoJavascript } from "react-icons/io5";

type TechItem = {
    name: string
    icon: ReactNode
}

type StackGroupProps = {
    title: string
    items: TechItem[]
    direction?: "normal" | "reverse"
    duration?: `${number}s`
}

type StackGroupDefinition = StackGroupProps & { id: string }

export default async function TechStack() {return (
    <div className=" container py-12"> 
    <div className=" flex lg:flex-row flex-col  border border-primary/20"> 

    <div className="flex min-w-1/3 items-center justify-center p-4 mb-6 lg:mb-0 
    min-h-full bg-primary/10 text-primary/90  text-sm font-medium 
    ">
        <span>
            Tech Stack
        </span>
    </div>   
    <div className="overflow-hidden p-4 flex flex-col gap-4">
    <InfiniteSlider
        className="text-6xl   text-gray-700 dark:text-gray-300" 
        reverse
        gap={72} 
        speedOnHover={5}       
        speed={20}>  
            <IoLogoJavascript  />
            <RiNextjsFill  />
            <SiMongodb  />
            <RiTailwindCssFill  />
            <SiTypescript  />
            <FaDocker  />
            <BiLogoPostgresql  />        
            <IoLogoJavascript  />
            <RiNextjsFill  />
            <SiMongodb  />
            <RiTailwindCssFill  />
            <SiTypescript  />
            <FaDocker  />
            <BiLogoPostgresql  />        
    </InfiniteSlider>
    <InfiniteSlider  
        className="text-6xl text-gray-700 dark:text-gray-300" 
        gap={72} 
        speedOnHover={5}       
        speed={20}>       
        <FaPython  />
        <GiArtificialIntelligence  />
        <FaGithub  />
        <FaAws  />
        <FaLinux  />
        <FaPython  />
        <GiArtificialIntelligence  />
        <FaGithub  />
        <FaAws  />
        <FaLinux  />
    </InfiniteSlider>
        </div>   
        </div>   
    </div>
)}