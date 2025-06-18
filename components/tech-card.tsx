import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface TechCardProps {
    name: string
    icon: React.ReactNode
}

export default function TechCard({ name, icon }: TechCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="font-medium text-sm">{name}</p>
            </CardContent>
        </Card>
    )
}
