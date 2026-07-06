'use client'

import {
    AArrowDownIcon,
    AArrowUpIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    Columns2Icon,
    EyeIcon,
    EyeOffIcon,
    Rows2Icon,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useFontScalePreference } from '@/hooks/use-font-scale-preference'
import { FONT_SCALE_STEP, MAX_FONT_SCALE, MIN_FONT_SCALE, TESTCASES_FONT_SCALE_KEY } from '@/lib/fontScale'
import { cn } from '@/lib/utils'
import type { DecodedTestcase } from '@/services/queries/problemDetail'

type ProblemTestcaseAccordionItemProps = {
    testcase: DecodedTestcase
    isOpen: boolean
    onToggle: () => void
}

function formatTestcaseText(text: string, showWhitespace: boolean): ReactNode {
    if (!showWhitespace) {
        return text
    }

    const parts: ReactNode[] = []

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index]

        if (char === ' ') {
            parts.push(
                <span key={index} className="text-muted-foreground">
                    ␣
                </span>,
            )
        } else if (char === '\n') {
            parts.push(
                <span key={index} className="text-muted-foreground">
                    ⏎
                </span>,
                '\n',
            )
        } else {
            parts.push(char)
        }
    }

    return parts
}

function TestcaseField({
    label,
    text,
    imageSrc,
    showWhitespace,
    fontScale,
}: {
    label: string
    text?: string
    imageSrc?: string
    showWhitespace: boolean
    fontScale: number
}) {
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)

    useEffect(() => {
        setImageSize(null)
    }, [imageSrc])

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <p className="ml-1 text-sm font-bold text-foreground">{label}</p>
            {imageSrc ? (
                <div className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageSrc}
                        alt={`${label} testcase`}
                        className="max-w-full origin-top-left"
                        style={{ width: `calc(100% * ${fontScale})` }}
                        onLoad={(event) => {
                            const img = event.currentTarget
                            setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
                        }}
                    />
                    {imageSize ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                            ({imageSize.width}×{imageSize.height})
                        </p>
                    ) : null}
                </div>
            ) : (
                <pre
                    className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm text-foreground"
                    style={{ fontSize: `calc(0.875rem * ${fontScale})` }}
                >
                    {formatTestcaseText(text ?? '', showWhitespace)}
                </pre>
            )}
        </div>
    )
}

export function ProblemTestcaseAccordionItem({ testcase, isOpen, onToggle }: ProblemTestcaseAccordionItemProps) {
    const [showWhitespace, setShowWhitespace] = useState(false)
    const [sideways, setSideways] = useState(true)
    const [fontScale, setFontScale] = useFontScalePreference(TESTCASES_FONT_SCALE_KEY)

    const expandLabel = isOpen ? `Collapse test case ${testcase.name}` : `Expand test case ${testcase.name}`

    return (
        <TooltipProvider>
            <Card className={cn('gap-0 pt-2 ring-0 border border-border shadow-sm', isOpen ? 'pb-0' : 'pb-2')}>
                <CardHeader className={cn('px-4 py-2', isOpen && 'border-b border-border')}>
                    <div className="flex w-full items-center gap-2">
                        <button
                            type="button"
                            onClick={onToggle}
                            aria-expanded={isOpen}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            <CardTitle className="text-lg font-semibold">{testcase.name}</CardTitle>
                        </button>
                        {isOpen ? (
                            <div className="inline-flex items-center gap-2">
                                <div className="inline-flex overflow-hidden rounded-lg border border-input">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                aria-label={
                                                    showWhitespace
                                                        ? 'Hide whitespace characters'
                                                        : 'Show whitespace characters'
                                                }
                                                onClick={() => setShowWhitespace((value) => !value)}
                                                className="rounded-none border-0 border-r border-input"
                                            >
                                                {showWhitespace ? <EyeOffIcon /> : <EyeIcon />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            {showWhitespace
                                                ? 'Hide whitespace characters'
                                                : 'Show whitespace characters'}
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                aria-label={
                                                    sideways
                                                        ? 'Stack input and output vertically'
                                                        : 'Show input and output side by side'
                                                }
                                                onClick={() => setSideways((value) => !value)}
                                                className="rounded-none border-0"
                                            >
                                                {sideways ? <Rows2Icon /> : <Columns2Icon />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            {sideways
                                                ? 'Stack input and output vertically'
                                                : 'Show input and output side by side'}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="inline-flex overflow-hidden rounded-lg border border-input">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon-sm"
                                                aria-label="Decrease test case font size"
                                                disabled={fontScale <= MIN_FONT_SCALE}
                                                onClick={() =>
                                                    setFontScale((scale) =>
                                                        Math.max(MIN_FONT_SCALE, scale - FONT_SCALE_STEP),
                                                    )
                                                }
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
                                                aria-label="Increase test case font size"
                                                disabled={fontScale >= MAX_FONT_SCALE}
                                                onClick={() =>
                                                    setFontScale((scale) =>
                                                        Math.min(MAX_FONT_SCALE, scale + FONT_SCALE_STEP),
                                                    )
                                                }
                                                className="rounded-none border-0"
                                            >
                                                <AArrowUpIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Increase font size</TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        ) : null}
                        <button
                            type="button"
                            onClick={onToggle}
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
                    <CardContent className="flex flex-col gap-4 px-6 py-4">
                        <div className={cn('grid gap-4', sideways && 'md:grid-cols-2')}>
                            <TestcaseField
                                label="Input"
                                text={testcase.input}
                                showWhitespace={showWhitespace}
                                fontScale={fontScale}
                            />
                            <TestcaseField
                                label="Output"
                                text={testcase.output}
                                imageSrc={testcase.outputImageSrc}
                                showWhitespace={showWhitespace}
                                fontScale={fontScale}
                            />
                        </div>
                    </CardContent>
                ) : null}
            </Card>
        </TooltipProvider>
    )
}
