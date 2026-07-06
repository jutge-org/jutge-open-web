'use client'

import { AArrowDownIcon, AArrowUpIcon } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useFontScalePreference } from '@/hooks/use-font-scale-preference'
import {
    formatCompilationErrorContent,
    type CompilationErrorField,
} from '@/lib/compilationErrors'
import {
    FONT_SCALE_STEP,
    MAX_FONT_SCALE,
    MIN_FONT_SCALE,
    SOURCE_CODE_FONT_SCALE_KEY,
} from '@/lib/fontScale'
import type { CompilationErrors } from '@/lib/jutge_api_client'

type CompilationErrorsCardProps = {
    data: CompilationErrors
    compilerId: string
}

const EXTRA_FIELDS = ['compilation2', 'linkage', 'interface'] as const

function hasOnlyCompilation1(data: CompilationErrors): boolean {
    return data.compilation2 === null && data.linkage === null && data.interface === null
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
                        aria-label="Decrease compilation errors font size"
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
                        aria-label="Increase compilation errors font size"
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

function CompilationErrorBlock({
    text,
    compilerId,
    field,
    fontScale,
    className,
}: {
    text: string
    compilerId: string
    field: CompilationErrorField
    fontScale: number
    className?: string
}) {
    const content = useMemo(
        () => formatCompilationErrorContent(text, compilerId, field),
        [text, compilerId, field],
    )

    return (
        <pre
            className={`overflow-auto p-4 font-mono leading-relaxed whitespace-pre-wrap text-foreground ${className ?? 'max-h-72'}`}
            style={{ fontSize: `calc(0.875rem * ${fontScale})` }}
        >
            {content.type === 'html' ? (
                <code dangerouslySetInnerHTML={{ __html: content.html }} />
            ) : (
                <code>{content.text}</code>
            )}
        </pre>
    )
}

export function CompilationErrorsCard({ data, compilerId }: CompilationErrorsCardProps) {
    const [fontScale, setFontScale] = useFontScalePreference(SOURCE_CODE_FONT_SCALE_KEY)
    const onlyCompilation1 = hasOnlyCompilation1(data)

    return (
        <TooltipProvider>
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg font-semibold">Compilation errors</CardTitle>
                    <CardAction>
                        <FontScaleButtons fontScale={fontScale} setFontScale={setFontScale} />
                    </CardAction>
                </CardHeader>
                {onlyCompilation1 ? (
                    <CardContent className="p-0">
                        <CompilationErrorBlock
                            text={data.compilation1 ?? ''}
                            compilerId={compilerId}
                            field="compilation1"
                            fontScale={fontScale}
                        />
                    </CardContent>
                ) : (
                    <CardContent className="flex flex-col gap-4 px-0 py-0">
                        <CompilationErrorBlock
                            text={data.compilation1 ?? ''}
                            compilerId={compilerId}
                            field="compilation1"
                            fontScale={fontScale}
                            className="max-h-72 border-b border-border"
                        />
                        {EXTRA_FIELDS.map((name) => {
                            const value = data[name]
                            if (value === null) {
                                return null
                            }

                            return (
                                <div key={name} className="flex flex-col gap-2 px-6 pb-6 last:pb-6">
                                    <p className="pt-4 text-sm font-medium text-foreground first:pt-0">{name}</p>
                                    <CompilationErrorBlock
                                        text={value}
                                        compilerId={compilerId}
                                        field={name}
                                        fontScale={fontScale}
                                        className="max-h-48 rounded-lg border border-border"
                                    />
                                </div>
                            )
                        })}
                    </CardContent>
                )}
            </Card>
        </TooltipProvider>
    )
}
