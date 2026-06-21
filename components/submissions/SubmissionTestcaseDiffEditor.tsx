'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const MonacoDiffEditor = dynamic(
    () => import('@monaco-editor/react').then((module) => module.DiffEditor),
    {
        ssr: false,
        loading: () => null,
    },
)

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
}

function SectionTitle({ children }: { children: string }) {
    return (
        <div className="shrink-0 border-b border-border bg-muted/30 px-4 py-2">
            <h2 className="text-sm font-semibold text-foreground">{children}</h2>
        </div>
    )
}

export function SubmissionTestcaseDiffEditor({ input, output, expected }: SubmissionTestcaseDiffEditorProps) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const theme = mounted && resolvedTheme === 'dark' ? 'vs-dark' : 'vs'

    return (
        <div className="flex h-full flex-col">
            <section className="flex h-[75%] min-h-0 flex-col">
                <SectionTitle>Output vs Expected</SectionTitle>
                <div className="min-h-0 flex-1">
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
            </section>
            <section className="flex h-[25%] min-h-0 flex-col border-t border-border">
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
            </section>
        </div>
    )
}
