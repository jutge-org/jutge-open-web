'use client'

import { AArrowDownIcon, AArrowUpIcon, ChevronDownIcon, ChevronUpIcon, Maximize2Icon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'

import { WidgetSpinner } from '@/components/general/WidgetSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useFontScalePreference } from '@/hooks/use-font-scale-preference'
import { useHljsThemeStyles } from '@/hooks/use-hljs-theme-styles'
import { useHljsThemePreference } from '@/hooks/use-hljs-theme-preference'
import { getDebugInformationFields, hasDebugInformation } from '@/lib/debugInformation'
import { FONT_SCALE_STEP, MAX_FONT_SCALE, MIN_FONT_SCALE, SOURCE_CODE_FONT_SCALE_KEY } from '@/lib/fontScale'
import { highlightYaml } from '@/lib/highlightYaml'
import jutge from '@/lib/jutge'
import type { DebugInformation } from '@/lib/jutge_api_client'
import { cn } from '@/lib/utils'

import '@/styles/submission-hljs.css'

type DebugInformationCardProps = {
    problemId: string
    submissionId: string
    debugHref: string
}

function FontScaleButtons({
    fontScale,
    setFontScale,
}: {
    fontScale: number
    setFontScale: (updater: number | ((prev: number) => number)) => void
}) {
    return (
        <div className="inline-flex overflow-hidden rounded-lg border border-input">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label="Decrease debug information font size"
                        disabled={fontScale <= MIN_FONT_SCALE}
                        onClick={() => setFontScale((scale) => Math.max(MIN_FONT_SCALE, scale - FONT_SCALE_STEP))}
                        className="rounded-none border-0 border-r border-input"
                    >
                        <AArrowDownIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Decrease font size</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label="Increase debug information font size"
                        disabled={fontScale >= MAX_FONT_SCALE}
                        onClick={() => setFontScale((scale) => Math.min(MAX_FONT_SCALE, scale + FONT_SCALE_STEP))}
                        className="rounded-none border-0"
                    >
                        <AArrowUpIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Increase font size</TooltipContent>
            </Tooltip>
        </div>
    )
}

const DEBUG_BOX_CONTENT_CLASS = 'max-h-64 overflow-auto p-4 font-mono leading-relaxed whitespace-pre text-foreground'

function HighlightedYamlBlock({ content, fontScale }: { content: string; fontScale: number }) {
    const [highlightTheme] = useHljsThemePreference()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useHljsThemeStyles(highlightTheme)

    const highlightedYaml = useMemo(() => highlightYaml(content), [content])
    const usesAutoTheme = highlightTheme === 'auto'
    const theme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

    return (
        <div
            className="submission-source-code"
            data-theme={usesAutoTheme ? theme : undefined}
            data-hljs-theme={usesAutoTheme ? undefined : highlightTheme}
            suppressHydrationWarning
        >
            <pre className={DEBUG_BOX_CONTENT_CLASS} style={{ fontSize: `calc(0.875rem * ${fontScale})` }}>
                <code className="hljs language-yaml" dangerouslySetInnerHTML={{ __html: highlightedYaml }} />
            </pre>
        </div>
    )
}

function TextBlock({ value, fontScale }: { value: string; fontScale: number }) {
    return (
        <pre className={DEBUG_BOX_CONTENT_CLASS} style={{ fontSize: `calc(0.875rem * ${fontScale})` }}>
            <code>{value}</code>
        </pre>
    )
}

function DebugInformationContent({ data, fontScale }: { data: DebugInformation; fontScale: number }) {
    const fields = useMemo(() => getDebugInformationFields(data), [data])

    if (fields.length === 0) {
        return <p className="py-6 text-center text-sm text-muted-foreground">No debug information available.</p>
    }

    return (
        <div className="flex flex-col gap-4">
            {fields.map((field) => (
                <div key={field.key} className="overflow-hidden rounded-lg border border-border">
                    <p className="border-b border-border bg-muted/40 px-4 py-2 text-sm font-medium text-foreground">
                        {field.label}
                    </p>
                    {field.kind === 'yaml' ? (
                        <HighlightedYamlBlock content={field.content} fontScale={fontScale} />
                    ) : (
                        <TextBlock value={field.content} fontScale={fontScale} />
                    )}
                </div>
            ))}
        </div>
    )
}

export function DebugInformationCard({ problemId, submissionId, debugHref }: DebugInformationCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<DebugInformation | null | undefined>(undefined)
    const [fontScale, setFontScale] = useFontScalePreference(SOURCE_CODE_FONT_SCALE_KEY)

    useEffect(() => {
        if (!isOpen || data !== undefined) {
            return
        }

        let cancelled = false

        void jutge.student.submissions
            .getDebugInformation({
                problem_id: problemId,
                submission_id: submissionId,
            })
            .then((result) => {
                if (!cancelled) setData(result)
            })
            .catch(() => {
                if (!cancelled) setData(null)
            })

        return () => {
            cancelled = true
        }
    }, [data, isOpen, problemId, submissionId])

    const expandLabel = isOpen ? 'Collapse debug information' : 'Expand debug information'
    const showToolbar = isOpen && hasDebugInformation(data)
    const pendingContent = isOpen && data === undefined

    return (
        <TooltipProvider>
            <Card className={cn('gap-0 pt-2 ring-0 border border-border shadow-sm', isOpen ? 'pb-0' : 'pb-2')}>
                <CardHeader className={cn('px-4 py-2', isOpen && 'border-b border-border')}>
                    <div className="flex w-full items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen((open) => !open)}
                            aria-expanded={isOpen}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            <CardTitle className="text-lg font-semibold">Debug information</CardTitle>
                        </button>
                        {showToolbar ? (
                            <div className="inline-flex items-center gap-2">
                                <FontScaleButtons fontScale={fontScale} setFontScale={setFontScale} />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label="Show debug information in full screen (opens in new window)"
                                        >
                                            <Link href={debugHref} target="_blank" rel="noopener noreferrer">
                                                <Maximize2Icon />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Show in full screen</TooltipContent>
                                </Tooltip>
                            </div>
                        ) : null}
                        <button
                            type="button"
                            onClick={() => setIsOpen((open) => !open)}
                            aria-label={expandLabel}
                            className="flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            {isOpen ? (
                                <ChevronUpIcon className="size-4 text-muted-foreground" aria-hidden />
                            ) : (
                                <ChevronDownIcon className="size-4 text-muted-foreground" aria-hidden />
                            )}
                        </button>
                    </div>
                </CardHeader>
                {isOpen ? (
                    <CardContent className="px-6 py-6">
                        {pendingContent ? <WidgetSpinner label="Loading debug information" /> : null}
                        {data !== undefined ? (
                            hasDebugInformation(data) && data ? (
                                <DebugInformationContent data={data} fontScale={fontScale} />
                            ) : (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    No debug information available.
                                </p>
                            )
                        ) : null}
                    </CardContent>
                ) : null}
            </Card>
        </TooltipProvider>
    )
}
