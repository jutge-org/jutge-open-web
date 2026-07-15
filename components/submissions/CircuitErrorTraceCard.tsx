import { CircuitModuleViewer } from '@/components/submissions/CircuitModuleViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type CircuitErrorTraceCardProps = {
    index: number
    svg: string
}

export function CircuitErrorTraceCard({ index, svg }: CircuitErrorTraceCardProps) {
    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold">Error trace {index}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center px-6 py-6">
                <CircuitModuleViewer
                    moduleName={`Error trace ${index}`}
                    svg={svg}
                    showTitle={false}
                    className="w-full max-w-4xl"
                    viewportClassName="h-96 w-full"
                />
            </CardContent>
        </Card>
    )
}
