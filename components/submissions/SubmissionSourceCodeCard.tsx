'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { saveAs } from 'file-saver'
import { AArrowDownIcon, AArrowUpIcon, ClipboardIcon, DownloadIcon, Maximize2Icon, PaletteIcon } from 'lucide-react'
import { toast } from 'sonner'

import { HighlightedSourceCode } from '@/components/submissions/HighlightedSourceCode'
import { useFontScalePreference } from '@/hooks/use-font-scale-preference'
import { useHljsThemePreference } from '@/hooks/use-hljs-theme-preference'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    FONT_SCALE_STEP,
    MAX_FONT_SCALE,
    MIN_FONT_SCALE,
    SOURCE_CODE_FONT_SCALE_KEY,
} from '@/lib/fontScale'
import { DEFAULT_HLJS_THEME, formatHljsThemeLabel, HLJS_THEMES, type HljsThemeSelection } from '@/lib/hljsThemes'
import { includesForSearch } from '@/lib/utils'

type SubmissionSourceCodeCardProps = {
    code: string
    codeExtension: string | null
    codeFilename: string
    codeHref: string
}

export function SubmissionSourceCodeCard({
    code,
    codeExtension,
    codeFilename,
    codeHref,
}: SubmissionSourceCodeCardProps) {
    const [fontScale, setFontScale] = useFontScalePreference(SOURCE_CODE_FONT_SCALE_KEY)
    const [highlightTheme, setHighlightTheme] = useHljsThemePreference()
    const [previewTheme, setPreviewTheme] = useState<HljsThemeSelection | null>(null)
    const [themeSearch, setThemeSearch] = useState('')

    const activeTheme = previewTheme ?? highlightTheme

    const filteredThemes = useMemo(() => {
        const query = themeSearch.trim()
        if (!query) {
            return HLJS_THEMES
        }

        return HLJS_THEMES.filter((theme) => {
            const label = formatHljsThemeLabel(theme)
            return includesForSearch(theme, query) || includesForSearch(label, query)
        })
    }, [themeSearch])

    function handleThemeMenuOpenChange(open: boolean) {
        if (!open) {
            setPreviewTheme(null)
            setThemeSearch('')
        }
    }

    function handleThemeSelect(value: HljsThemeSelection) {
        setHighlightTheme(value)
        setPreviewTheme(null)
    }

    function copyCode() {
        navigator.clipboard.writeText(code).then(
            () => toast.success('Copied to clipboard'),
            () => toast.error('Failed to copy'),
        )
    }

    function downloadCode() {
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, codeFilename)
    }

    return (
        <TooltipProvider>
            <Card className="ring-0 border border-border shadow-sm">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold">Source code</CardTitle>
                <CardAction>
                    <div className="inline-flex items-center gap-2">
                        <div className="inline-flex overflow-hidden rounded-lg border border-input">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label="Decrease source code font size"
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
                                        aria-label="Increase source code font size"
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
                        <DropdownMenu onOpenChange={handleThemeMenuOpenChange}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon-sm"
                                            aria-label="Change syntax highlighting theme"
                                        >
                                            <PaletteIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top">Change highlight theme</TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end" className="w-64 p-0">
                                <div className="border-b border-border p-2">
                                    <Input
                                        type="search"
                                        value={themeSearch}
                                        onChange={(event) => setThemeSearch(event.target.value)}
                                        onKeyDown={(event) => event.stopPropagation()}
                                        placeholder="Search themes…"
                                        aria-label="Search highlight themes"
                                    />
                                </div>
                                <ScrollArea className="h-72" onPointerLeave={() => setPreviewTheme(null)}>
                                    <div className="p-1">
                                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                                        <DropdownMenuRadioGroup
                                            value={highlightTheme}
                                            onValueChange={(value) => handleThemeSelect(value as HljsThemeSelection)}
                                        >
                                            <DropdownMenuRadioItem
                                                value={DEFAULT_HLJS_THEME}
                                                onPointerEnter={() => setPreviewTheme(DEFAULT_HLJS_THEME)}
                                                onFocus={() => setPreviewTheme(DEFAULT_HLJS_THEME)}
                                            >
                                                Auto
                                            </DropdownMenuRadioItem>
                                            {filteredThemes.map((theme) => (
                                                <DropdownMenuRadioItem
                                                    key={theme}
                                                    value={theme}
                                                    onPointerEnter={() => setPreviewTheme(theme)}
                                                    onFocus={() => setPreviewTheme(theme)}
                                                >
                                                    {formatHljsThemeLabel(theme)}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </div>
                                </ScrollArea>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="inline-flex overflow-hidden rounded-lg border border-input">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label="Copy source code to clipboard"
                                        onClick={copyCode}
                                        className="rounded-none border-0 border-r border-input"
                                    >
                                        <ClipboardIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Copy to clipboard</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label="Download source code"
                                        onClick={downloadCode}
                                        className="rounded-none border-0 border-r border-input"
                                    >
                                        <DownloadIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Download source code</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label="Show source code in full screen"
                                        className="rounded-none border-0"
                                    >
                                        <Link href={codeHref} target="_blank" rel="noopener noreferrer">
                                            <Maximize2Icon />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Show in full screen</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent className="p-0">
                <HighlightedSourceCode
                    code={code}
                    codeExtension={codeExtension}
                    fontScale={fontScale}
                    highlightTheme={activeTheme}
                />
            </CardContent>
            </Card>
        </TooltipProvider>
    )
}
