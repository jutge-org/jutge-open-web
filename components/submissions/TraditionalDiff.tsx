'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'

import { highlightSubmissionCode } from '@/lib/highlightCode'
import { parseTraditionalDiff, type TraditionalDiffLine } from '@/lib/traditionalDiff'
import { cn } from '@/lib/utils'

import '@/styles/submission-hljs.css'

type TraditionalDiffProps = {
    diff: string
    fontScale?: number
    className?: string
    codeExtension?: string | null
}

const LINE_STYLES: Record<TraditionalDiffLine['kind'], string> = {
    'hunk-header': 'bg-muted/40 text-muted-foreground',
    'file-header': 'text-muted-foreground',
    separator: 'text-muted-foreground',
    remove: 'bg-red-500/10 text-red-700 dark:text-red-300',
    add: 'bg-green-500/10 text-green-700 dark:text-green-300',
    context: 'text-foreground',
    plain: 'text-foreground',
}

function isCodeLine(
    line: TraditionalDiffLine,
): line is Extract<TraditionalDiffLine, { kind: 'remove' | 'add' | 'context' }> {
    return line.kind === 'remove' || line.kind === 'add' || line.kind === 'context'
}

function TraditionalDiffLineView({ line, codeExtension }: { line: TraditionalDiffLine; codeExtension: string | null }) {
    const highlightedContent = useMemo(() => {
        if (!isCodeLine(line) || !line.text) {
            return null
        }

        return highlightSubmissionCode(line.text, codeExtension)
    }, [codeExtension, line])

    const prefix = isCodeLine(line) ? line.prefix : ''
    const plainContent =
        line.kind === 'separator'
            ? '---'
            : line.kind === 'hunk-header' || line.kind === 'file-header' || line.kind === 'plain'
              ? line.text
              : line.text

    return (
        <div className={cn('px-4 font-mono leading-relaxed whitespace-pre-wrap', LINE_STYLES[line.kind])}>
            {prefix ? <span className="select-none opacity-70">{prefix}</span> : null}
            {highlightedContent ? (
                <code className="hljs bg-transparent p-0" dangerouslySetInnerHTML={{ __html: highlightedContent }} />
            ) : (
                <code>{plainContent}</code>
            )}
        </div>
    )
}

export function TraditionalDiff({ diff, fontScale = 1, className, codeExtension = 'v' }: TraditionalDiffProps) {
    const lines = useMemo(() => parseTraditionalDiff(diff), [diff])
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const theme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

    return (
        <div
            className={cn('traditional-diff overflow-auto py-4', className)}
            data-theme={theme}
            style={{ fontSize: `calc(0.875rem * ${fontScale})` }}
        >
            {lines.map((line, index) => (
                <TraditionalDiffLineView key={`${line.kind}-${index}`} line={line} codeExtension={codeExtension} />
            ))}
        </div>
    )
}
