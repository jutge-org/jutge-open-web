'use client'

import { CircuitModuleViewer } from '@/components/submissions/CircuitModuleViewer'
import { TooltipProvider } from '@/components/ui/tooltip'

type CircuitModuleEditorProps = {
    submissionId: string
    moduleName: string
    svg: string
}

export function CircuitModuleEditor({ submissionId, moduleName, svg }: CircuitModuleEditorProps) {
    return (
        <TooltipProvider>
            <div className="flex h-full min-h-0 flex-col">
                <header className="flex shrink-0 items-center border-b border-border px-4 py-2">
                    <h1 className="min-w-0 truncate text-sm font-semibold text-foreground">
                        {submissionId} — {moduleName}
                    </h1>
                </header>
                <div className="flex min-h-0 flex-1 items-center justify-center p-4">
                    <CircuitModuleViewer moduleName={moduleName} svg={svg} variant="fullscreen" />
                </div>
            </div>
        </TooltipProvider>
    )
}
