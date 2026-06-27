'use client'

import { CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'

type StatisticsStatCardProps = {
    title: string
    children: React.ReactNode
    defaultHeight?: number
}

export function StatisticsStatCard({ title, children, defaultHeight = 360 }: StatisticsStatCardProps) {
    return (
        <ResizableCard className="w-full" defaultHeight={defaultHeight}>
            <CardHeader className="p-4">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">{children}</CardContent>
        </ResizableCard>
    )
}
