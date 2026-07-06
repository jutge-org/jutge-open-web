'use client'

import { AArrowDownIcon, AArrowUpIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useFontScalePreference } from '@/hooks/use-font-scale-preference'
import { useHljsThemeStyles } from '@/hooks/use-hljs-theme-styles'
import { useHljsThemePreference } from '@/hooks/use-hljs-theme-preference'
import {
    FONT_SCALE_STEP,
    MAX_FONT_SCALE,
    MIN_FONT_SCALE,
    SOURCE_CODE_FONT_SCALE_KEY,
} from '@/lib/fontScale'
import { highlightYamlObject } from '@/lib/highlightYaml'
import type { DebugInformation } from '@/lib/jutge_api_client'

import '@/styles/submission-hljs.css'

type DebugInformationCardProps = {
    data: DebugInformation
}

type DebugField =
    | { key: 'correction' | 'solution' | 'directories'; label: string; kind: 'yaml'; value: unknown }
    | { key: 'stderr' | 'stdout'; label: string; kind: 'text'; value: string }

const DEBUG_FIELDS: { key: keyof DebugInformation; label: string; kind: 'yaml' | 'text' }[] = [
    { key: 'correction', label: 'Correction', kind: 'yaml' },
    { key: 'solution', label: 'Solution', kind: 'yaml' },
    { key: 'stderr', label: 'stderr', kind: 'text' },
    { key: 'stdout', label: 'stdout', kind: 'text' },
    { key: 'directories', label: 'Directories', kind: 'yaml' },
]

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

const DEBUG_BOX_CONTENT_CLASS =
    'max-h-96 overflow-auto p-4 font-mono leading-relaxed whitespace-pre text-foreground'

function HighlightedYamlBlock({ value, fontScale }: { value: unknown; fontScale: number }) {
    const [highlightTheme] = useHljsThemePreference()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useHljsThemeStyles(highlightTheme)

    const highlightedYaml = useMemo(() => highlightYamlObject(value), [value])
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

export function DebugInformationCard({ data }: DebugInformationCardProps) {
    const [fontScale, setFontScale] = useFontScalePreference(SOURCE_CODE_FONT_SCALE_KEY)

    const fields = useMemo((): DebugField[] => {
        const items: DebugField[] = []

        for (const field of DEBUG_FIELDS) {
            const value = data[field.key]
            if (value == null) {
                continue
            }

            if (field.kind === 'text') {
                items.push({
                    key: field.key as 'stderr' | 'stdout',
                    label: field.label,
                    kind: 'text',
                    value: value as string,
                })
            } else {
                items.push({
                    key: field.key as 'correction' | 'solution' | 'directories',
                    label: field.label,
                    kind: 'yaml',
                    value,
                })
            }
        }

        return items
    }, [data])

    if (fields.length === 0) {
        return null
    }

    return (
        <TooltipProvider>
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg font-semibold">Debug information</CardTitle>
                    <CardAction>
                        <FontScaleButtons fontScale={fontScale} setFontScale={setFontScale} />
                    </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 px-6 py-6">
                    {fields.map((field) => (
                        <div key={field.key} className="overflow-hidden rounded-lg border border-border">
                            <p className="border-b border-border bg-muted/40 px-4 py-2 text-sm font-medium text-foreground">
                                {field.label}
                            </p>
                            {field.kind === 'yaml' ? (
                                <HighlightedYamlBlock value={field.value} fontScale={fontScale} />
                            ) : (
                                <TextBlock value={field.value} fontScale={fontScale} />
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
