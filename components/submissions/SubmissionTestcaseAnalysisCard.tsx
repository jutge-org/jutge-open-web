'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import {
    AArrowDownIcon,
    AArrowUpIcon,
    BlendIcon,
    Columns2Icon,
    EyeIcon,
    EyeOffIcon,
    GitCompareArrowsIcon,
    Rows2Icon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { GraphicTestcaseDiffView } from '@/components/submissions/GraphicTestcaseDiffView'
import { useFontScalePreference } from '@/hooks/use-font-scale-preference'
import { FONT_SCALE_STEP, MAX_FONT_SCALE, MIN_FONT_SCALE, TESTCASES_FONT_SCALE_KEY } from '@/lib/fontScale'
import { cn } from '@/lib/utils'
import type { SubmissionTestcaseAnalysisData } from '@/services/queries/submissions'

type SubmissionTestcaseAnalysisCardProps = {
    data: SubmissionTestcaseAnalysisData
    diffHref: string
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

export function SubmissionTestcaseAnalysisCard({ data, diffHref }: SubmissionTestcaseAnalysisCardProps) {
    const [showWhitespace, setShowWhitespace] = useState(false)
    const [sideways, setSideways] = useState(true)
    const [showImageDiff, setShowImageDiff] = useState(false)
    const [fontScale, setFontScale] = useFontScalePreference(TESTCASES_FONT_SCALE_KEY)
    const isGraphic = Boolean(data.outputImageSrc && data.expectedImageSrc)

    return (
        <TooltipProvider>
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg font-semibold">Analysis of test case {data.testcase}</CardTitle>
                    <CardAction>
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
                                        {showWhitespace ? 'Hide whitespace characters' : 'Show whitespace characters'}
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
                                                    ? 'Stack output and expected vertically'
                                                    : 'Show output and expected side by side'
                                            }
                                            onClick={() => setSideways((value) => !value)}
                                            className="rounded-none border-0 border-r border-input"
                                        >
                                            {sideways ? <Rows2Icon /> : <Columns2Icon />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        {sideways
                                            ? 'Stack output and expected vertically'
                                            : 'Show output and expected side by side'}
                                    </TooltipContent>
                                </Tooltip>
                                {isGraphic ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant={showImageDiff ? 'default' : 'outline'}
                                                size="sm"
                                                aria-label={
                                                    showImageDiff
                                                        ? 'Hide image difference view'
                                                        : 'Show image difference view'
                                                }
                                                aria-pressed={showImageDiff}
                                                onClick={() => setShowImageDiff((value) => !value)}
                                                className="rounded-none border-0"
                                            >
                                                <BlendIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            {showImageDiff
                                                ? 'Hide image difference view'
                                                : 'Show image difference view'}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : null}
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
                            <div className="inline-flex overflow-hidden rounded-lg border border-input">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label="Show output diff in full screen (opens in new window)"
                                            className="rounded-none border-0"
                                        >
                                            <Link href={diffHref} target="_blank" rel="noopener noreferrer">
                                                <GitCompareArrowsIcon />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Compare diffs in full screen</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 px-6 py-4">
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <dl className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <dt className="font-medium text-foreground">Execution:</dt>
                                <dd className="inline-flex items-center gap-2 font-bold text-foreground">
                                    <span aria-hidden>{data.execution === 'OK' ? '✅' : '❌'}</span>
                                    {data.execution}
                                </dd>
                            </div>
                            <div className="flex items-center gap-2">
                                <dt className="font-medium text-foreground">Verdict:</dt>
                                <dd className="inline-flex items-center gap-2 font-bold text-foreground">
                                    {data.verdictEmoji ? <span aria-hidden>{data.verdictEmoji}</span> : null}
                                    {data.verdict}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <TestcaseField
                        label="Input"
                        text={data.input}
                        showWhitespace={showWhitespace}
                        fontScale={fontScale}
                    />
                    {isGraphic && showImageDiff ? (
                        <GraphicTestcaseDiffView
                            outputImageSrc={data.outputImageSrc!}
                            expectedImageSrc={data.expectedImageSrc!}
                            variant="embedded"
                            fontScale={fontScale}
                            sideways={sideways}
                        />
                    ) : (
                        <div className={cn('grid gap-4', sideways && 'md:grid-cols-2')}>
                            <TestcaseField
                                label="Output"
                                text={data.output}
                                imageSrc={data.outputImageSrc}
                                showWhitespace={showWhitespace}
                                fontScale={fontScale}
                            />
                            <TestcaseField
                                label="Expected"
                                text={data.expected}
                                imageSrc={data.expectedImageSrc}
                                showWhitespace={showWhitespace}
                                fontScale={fontScale}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
