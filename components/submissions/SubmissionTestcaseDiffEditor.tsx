'use client'

import { GraphicTestcaseDiffView } from '@/components/submissions/GraphicTestcaseDiffView'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const MonacoDiffEditor = dynamic(() => import('@monaco-editor/react').then((module) => module.DiffEditor), {
    ssr: false,
    loading: () => null,
})

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => null,
})

const monacoOptions = {
    automaticLayout: true,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: 14,
    lineNumbers: 'on' as const,
    minimap: { enabled: false },
    readOnly: true,
    scrollBeyondLastLine: false,
    wordWrap: 'off' as const,
}

type SubmissionTestcaseDiffEditorProps = {
    input: string
    output: string
    expected: string
    outputImageSrc?: string
    expectedImageSrc?: string
}

function SectionTitle({ children }: { children: string }) {
    return (
        <div className="shrink-0 px-4 py-2">
            <h2 className="text-center text-sm font-semibold text-foreground">{children}</h2>
        </div>
    )
}

export function SubmissionTestcaseDiffEditor({
    input,
    output,
    expected,
    outputImageSrc,
    expectedImageSrc,
}: SubmissionTestcaseDiffEditorProps) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const theme = mounted && resolvedTheme === 'dark' ? 'vs-dark' : 'vs'
    const isGraphic = Boolean(outputImageSrc && expectedImageSrc)

    return (
        <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize={75} minSize={25} className="flex min-h-0 flex-col">
                {!isGraphic ? (
                    <>
                        <div className="grid shrink-0 grid-cols-2 px-4 py-2">
                            <h2 className="text-sm font-semibold text-foreground">Output</h2>
                            <h2 className="pr-10 text-right text-sm font-semibold text-foreground">Expected</h2>
                        </div>
                        <div className="min-h-0 flex-1 pb-2">
                            <MonacoDiffEditor
                                height="100%"
                                language="plaintext"
                                original={output}
                                modified={expected}
                                originalModelPath="output.txt"
                                modifiedModelPath="expected.txt"
                                theme={theme}
                                options={{
                                    ...monacoOptions,
                                    renderSideBySide: true,
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <GraphicTestcaseDiffView outputImageSrc={outputImageSrc!} expectedImageSrc={expectedImageSrc!} />
                )}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={15} className="flex min-h-0 flex-col">
                <SectionTitle>Input</SectionTitle>
                <div className="min-h-0 flex-1">
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="plaintext"
                        defaultValue={input}
                        theme={theme}
                        options={monacoOptions}
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
