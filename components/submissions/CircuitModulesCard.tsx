import { CircuitModuleViewer } from '@/components/submissions/CircuitModuleViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { circuitModuleViewHref } from '@/lib/circuits'

type CircuitModulesCardProps = {
    modules: Record<string, string>
    problemKey: string
    submissionId: string
}

export function CircuitModulesCard({ modules, problemKey, submissionId }: CircuitModulesCardProps) {
    const entries = Object.entries(modules)

    if (entries.length === 0) {
        return null
    }

    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold">Circuit modules</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-6">
                <div className="flex flex-wrap justify-center gap-8">
                    {entries.map(([moduleName, svg]) => (
                        <CircuitModuleViewer
                            key={moduleName}
                            moduleName={moduleName}
                            svg={svg}
                            viewHref={circuitModuleViewHref(problemKey, submissionId, moduleName)}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
