'use client'

import { useState, type ReactNode } from 'react'
import { AArrowDownIcon, AArrowUpIcon, Columns2Icon, PilcrowIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { DecodedTestcase } from '@/services/queries/problemDetail'

const MIN_SCALE = 0.85
const MAX_SCALE = 1.5
const SCALE_STEP = 0.1

type PublicTestcasesProps = {
    testcases: DecodedTestcase[]
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
    showWhitespace,
    fontScale,
}: {
    label: string
    text: string
    showWhitespace: boolean
    fontScale: number
}) {
    return (
        <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-bold text-foreground">{label}</p>
            <pre
                className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm text-foreground"
                style={{ fontSize: `calc(0.875rem * ${fontScale})` }}
            >
                {formatTestcaseText(text, showWhitespace)}
            </pre>
        </div>
    )
}

export function PublicTestcases({ testcases }: PublicTestcasesProps) {
    const [showWhitespace, setShowWhitespace] = useState(false)
    const [sideways, setSideways] = useState(true)
    const [fontScale, setFontScale] = useState(1)

    return (
        <TooltipProvider>
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle>Public test cases</CardTitle>
                    <CardAction>
                        <div className="inline-flex items-center gap-2">
                            <div className="inline-flex overflow-hidden rounded-lg border border-input">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Toggle
                                            variant="outline"
                                            size="sm"
                                            pressed={showWhitespace}
                                            onPressedChange={setShowWhitespace}
                                            aria-label="Show special characters"
                                            className="rounded-none border-0 border-r border-input"
                                        >
                                            <PilcrowIcon />
                                        </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Show whitespace characters</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Toggle
                                            variant="outline"
                                            size="sm"
                                            pressed={sideways}
                                            onPressedChange={setSideways}
                                            aria-label="Show input and output side by side"
                                            className="rounded-none border-0"
                                        >
                                            <Columns2Icon />
                                        </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Show input and output side by side</TooltipContent>
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
                                            disabled={fontScale <= MIN_SCALE}
                                            onClick={() =>
                                                setFontScale((scale) => Math.max(MIN_SCALE, scale - SCALE_STEP))
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
                                            disabled={fontScale >= MAX_SCALE}
                                            onClick={() =>
                                                setFontScale((scale) => Math.min(MAX_SCALE, scale + SCALE_STEP))
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
                    </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col divide-y divide-border pt-0">
                    {testcases.map((testcase) => (
                        <div key={testcase.name} className="py-6 first:pt-6 last:pb-0">
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
                                    showWhitespace={showWhitespace}
                                    fontScale={fontScale}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
