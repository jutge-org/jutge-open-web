import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ProblemStubCardProps = {
    title: string
    description: string
}

export function ProblemStubCard({ title, description }: ProblemStubCardProps) {
    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">This section is not available yet.</p>
            </CardContent>
        </Card>
    )
}
