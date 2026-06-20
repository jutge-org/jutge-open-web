'use client'

import { useMemo, useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

import { useHljsThemeStyles } from '@/hooks/use-hljs-theme-styles'
import { highlightSubmissionCode } from '@/lib/highlightCode'
import type { HljsThemeSelection } from '@/lib/hljsThemes'

import '@/styles/submission-hljs.css'

type HighlightedSourceCodeProps = {
    code: string
    codeExtension: string | null
    fontScale: number
    highlightTheme: HljsThemeSelection
}

export function HighlightedSourceCode({ code, codeExtension, fontScale, highlightTheme }: HighlightedSourceCodeProps) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useHljsThemeStyles(highlightTheme)

    const highlightedCode = useMemo(() => highlightSubmissionCode(code, codeExtension), [code, codeExtension])
    const usesAutoTheme = highlightTheme === 'auto'
    const theme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

    return (
        <div
            className="submission-source-code"
            data-theme={usesAutoTheme ? theme : undefined}
            data-hljs-theme={usesAutoTheme ? undefined : highlightTheme}
            suppressHydrationWarning
        >
            <pre
                className="max-h-72 overflow-auto p-4 font-mono leading-relaxed whitespace-pre"
                style={{ fontSize: `calc(0.875rem * ${fontScale})` }}
            >
                <code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
        </div>
    )
}
