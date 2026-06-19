'use client'

import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import { AArrowDownIcon, AArrowUpIcon, FileArchive, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const MIN_SCALE = 0.85
const MAX_SCALE = 1.5
const SCALE_STEP = 0.1

type ProblemStatementProps = {
    pageKey: string
    shortHtmlStatement: string
}

export function ProblemStatement({ pageKey, shortHtmlStatement }: ProblemStatementProps) {
    const [fontScale, setFontScale] = useState(1)

    return (
        <TooltipProvider>
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle>Statement</CardTitle>
                    <CardAction>
                        <div className="inline-flex overflow-hidden rounded-lg border border-input">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label="Decrease statement font size"
                                        disabled={fontScale <= MIN_SCALE}
                                        onClick={() => setFontScale((scale) => Math.max(MIN_SCALE, scale - SCALE_STEP))}
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
                                        aria-label="Increase statement font size"
                                        disabled={fontScale >= MAX_SCALE}
                                        onClick={() => setFontScale((scale) => Math.min(MAX_SCALE, scale + SCALE_STEP))}
                                        className="rounded-none border-0"
                                    >
                                        <AArrowUpIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Increase font size</TooltipContent>
                            </Tooltip>
                        </div>
                    </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 pt-6">
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={`/problems/${pageKey}/pdf`}
                            className="inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 px-5 py-4 transition-colors hover:bg-muted"
                        >
                            <FileText className="size-10 text-red-600 dark:text-red-400" aria-hidden />
                            <span className="text-sm font-medium text-foreground">PDF</span>
                        </Link>
                        <Link
                            href={`/problems/${pageKey}/zip`}
                            className="inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 px-5 py-4 transition-colors hover:bg-muted"
                        >
                            <FileArchive className="size-10 text-amber-600 dark:text-amber-400" aria-hidden />
                            <span className="text-sm font-medium text-foreground">ZIP</span>
                        </Link>
                    </div>
                    <div
                        className="statement-section text-foreground"
                        style={{ '--statement-scale': fontScale } as CSSProperties}
                        dangerouslySetInnerHTML={{ __html: shortHtmlStatement }}
                    />
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
