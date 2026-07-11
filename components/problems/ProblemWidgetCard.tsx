import { WidgetSpinner } from '@/components/general/WidgetSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type ProblemWidgetCardProps = {
    title: string
    loading?: boolean
    className?: string
    children?: ReactNode
}

export function ProblemWidgetCard({ title, loading = true, className, children }: ProblemWidgetCardProps) {
    return (
        <Card className={cn('ring-0 border border-border shadow-sm', className)}>
            <CardHeader className="border-b border-border">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{loading ? <WidgetSpinner label={`Loading ${title.toLowerCase()}`} /> : children}</CardContent>
        </Card>
    )
}
