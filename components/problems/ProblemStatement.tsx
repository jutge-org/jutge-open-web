'use client'

import Link from 'next/link'
import { type CSSProperties } from 'react'
import { AArrowDownIcon, AArrowUpIcon, FileArchive, FileIcon, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useFontScalePreference } from '@/hooks/use-font-scale-preference'
import { FONT_SCALE_STEP, MAX_FONT_SCALE, MIN_FONT_SCALE, STATEMENT_FONT_SCALE_KEY } from '@/lib/fontScale'

type ProblemStatementProps = {
    pageKey: string
    shortHtmlStatement: string
    templates: string[]
}

const downloadTileClassName =
    'inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-4 transition-colors hover:bg-muted'

const downloadTileLabelClassName = 'max-w-24 truncate text-center text-xs text-muted-foreground'

function getTemplateIconClassName(template: string) {
    return template.startsWith('main')
        ? 'size-10 text-sky-600 dark:text-sky-400'
        : 'size-10 text-green-600 dark:text-green-400'
}

export function ProblemStatement({ pageKey, shortHtmlStatement, templates }: ProblemStatementProps) {
    const [fontScale, setFontScale] = useFontScalePreference(STATEMENT_FONT_SCALE_KEY)

    // hack to get correct HTML statement for games, because they contain <html> and <body> tags
    shortHtmlStatement = shortHtmlStatement.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? shortHtmlStatement

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
                                        <AArrowDownIcon aria-hidden />
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
                                        <AArrowUpIcon aria-hidden />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Increase font size</TooltipContent>
                            </Tooltip>
                        </div>
                    </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 pt-0">
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={`/problems/${pageKey}/pdf`}
                            aria-label="Download problem statement as PDF"
                            className={downloadTileClassName}
                        >
                            <FileText
                                className="size-10 text-red-600 dark:text-red-400"
                                aria-hidden
                                strokeWidth={0.7}
                            />
                            <span className={downloadTileLabelClassName}>pdf</span>
                        </Link>
                        <Link
                            href={`/problems/${pageKey}/zip`}
                            aria-label="Download problem files as ZIP"
                            className={downloadTileClassName}
                        >
                            <FileArchive
                                className="size-10 text-amber-600 dark:text-amber-400"
                                aria-hidden
                                strokeWidth={0.7}
                            />
                            <span className={downloadTileLabelClassName}>zip</span>
                        </Link>
                        {templates.map((template) => (
                            <Link
                                key={template}
                                href={`/problems/${pageKey}/template?file=${encodeURIComponent(template)}`}
                                aria-label={`Download ${template}`}
                                className={downloadTileClassName}
                            >
                                <FileIcon
                                    className={getTemplateIconClassName(template)}
                                    aria-hidden
                                    strokeWidth={0.7}
                                />
                                <span className={downloadTileLabelClassName}>{template}</span>
                            </Link>
                        ))}
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
