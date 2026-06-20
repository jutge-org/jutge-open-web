'use client'

import Link from 'next/link'
import { type CSSProperties } from 'react'
import { AArrowDownIcon, AArrowUpIcon, FileArchive, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useFontScalePreference } from '@/hooks/use-font-scale-preference'
import {
    FONT_SCALE_STEP,
    MAX_FONT_SCALE,
    MIN_FONT_SCALE,
    STATEMENT_FONT_SCALE_KEY,
} from '@/lib/fontScale'

type ProblemStatementProps = {
    pageKey: string
    shortHtmlStatement: string
}

export function ProblemStatement({ pageKey, shortHtmlStatement }: ProblemStatementProps) {
    const [fontScale, setFontScale] = useFontScalePreference(STATEMENT_FONT_SCALE_KEY)

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
                                        disabled={fontScale <= MIN_FONT_SCALE}
                                        onClick={() =>
                                            setFontScale((scale) => Math.max(MIN_FONT_SCALE, scale - FONT_SCALE_STEP))
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
                                        aria-label="Increase statement font size"
                                        disabled={fontScale >= MAX_FONT_SCALE}
                                        onClick={() =>
                                            setFontScale((scale) => Math.min(MAX_FONT_SCALE, scale + FONT_SCALE_STEP))
                                        }
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
