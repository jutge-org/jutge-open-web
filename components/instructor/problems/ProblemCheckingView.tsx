'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { EyeIcon, ChevronDownIcon, ChevronUpIcon, Maximize2Icon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { WidgetSpinner } from '@/components/general/WidgetSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useHljsThemePreference } from '@/hooks/use-hljs-theme-preference'
import { useHljsThemeStyles } from '@/hooks/use-hljs-theme-styles'
import { fetchProblemSubmissionsRowsAction } from '@/lib/data/submissionsActions'
import { getDebugInformationFields, hasDebugInformation, type DebugInformationField } from '@/lib/debugInformation'
import { highlightYaml } from '@/lib/highlightYaml'
import jutge from '@/lib/jutge'
import type { DebugInformation } from '@/lib/jutge_api_client'
import type { ProblemSubmissionRow } from '@/lib/submissions'
import { cn } from '@/lib/utils'

import '@/styles/submission-hljs.css'

dayjs.extend(relativeTime)

const PROBLEM_CHECKER_ANNOTATION_PREFIX = 'problem-checker'

function isProblemCheckerSubmission(row: ProblemSubmissionRow): boolean {
    return row.annotation?.startsWith(PROBLEM_CHECKER_ANNOTATION_PREFIX) ?? false
}

async function fetchProblemCheckerSubmissions(problem_nm: string): Promise<ProblemSubmissionRow[]> {
    const rows = await fetchProblemSubmissionsRowsAction(problem_nm)
    return rows.filter(isProblemCheckerSubmission)
}

function DebugFieldContent({ field }: { field: DebugInformationField }) {
    const [highlightTheme] = useHljsThemePreference()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useHljsThemeStyles(highlightTheme)

    const highlightedYaml = useMemo(
        () => (field.kind === 'yaml' ? highlightYaml(field.content) : null),
        [field.content, field.kind],
    )
    const usesAutoTheme = highlightTheme === 'auto'
    const theme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

    if (field.kind === 'yaml' && highlightedYaml) {
        return (
            <div
                className="submission-source-code overflow-hidden rounded-lg border border-border"
                data-theme={usesAutoTheme ? theme : undefined}
                data-hljs-theme={usesAutoTheme ? undefined : highlightTheme}
                suppressHydrationWarning
            >
                <pre className="overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre text-foreground">
                    <code className="hljs language-yaml" dangerouslySetInnerHTML={{ __html: highlightedYaml }} />
                </pre>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-lg border border-border">
            <pre className="overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre text-foreground">
                <code>{field.content}</code>
            </pre>
        </div>
    )
}

function ProblemCheckerDebugTabs({ fields }: { fields: DebugInformationField[] }) {
    const [activeTab, setActiveTab] = useState(fields[0]?.key ?? '')

    useEffect(() => {
        if (!fields.some((field) => field.key === activeTab)) {
            setActiveTab(fields[0]?.key ?? '')
        }
    }, [activeTab, fields])

    if (fields.length === 0) {
        return <p className="py-6 text-center text-sm text-muted-foreground">No debug information available.</p>
    }

    return (
        <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as DebugInformationField['key'])}
            className="gap-3"
        >
            <div className="overflow-x-auto">
                <TabsList className="w-full">
                    {fields.map((field) => (
                        <TabsTrigger key={field.key} value={field.key} className="w-32 truncate">
                            {field.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            {fields.map((field) => (
                <TabsContent key={field.key} value={field.key}>
                    <DebugFieldContent field={field} />
                </TabsContent>
            ))}
        </Tabs>
    )
}

function ProblemCheckerDebugContent({ row }: { row: ProblemSubmissionRow }) {
    const [debugInformation, setDebugInformation] = useState<DebugInformation | null | undefined>(undefined)

    useEffect(() => {
        let cancelled = false
        setDebugInformation(undefined)

        void jutge.student.submissions
            .getDebugInformation({
                problem_id: row.problem_id,
                submission_id: row.submission_id,
            })
            .then((data) => {
                if (!cancelled) setDebugInformation(data)
            })
            .catch(() => {
                if (!cancelled) setDebugInformation(null)
            })

        return () => {
            cancelled = true
        }
    }, [row.problem_id, row.submission_id])

    const fields = useMemo(
        () =>
            hasDebugInformation(debugInformation) && debugInformation
                ? getDebugInformationFields(debugInformation)
                : [],
        [debugInformation],
    )

    if (debugInformation === undefined) {
        return <WidgetSpinner label="Loading debug information" />
    }

    if (fields.length === 0) {
        return <p className="py-6 text-center text-sm text-muted-foreground">No debug information available.</p>
    }

    return <ProblemCheckerDebugTabs fields={fields} />
}

function ProblemCheckerAccordionItem({
    row,
    isOpen,
    onToggle,
}: {
    row: ProblemSubmissionRow
    isOpen: boolean
    onToggle: () => void
}) {
    const expandLabel = isOpen ? `Collapse submission ${row.submission_id}` : `Expand submission ${row.submission_id}`

    return (
        <Card className={cn('gap-0 pt-2 ring-0 border border-border shadow-sm', isOpen ? 'pb-0' : 'pb-2')}>
            <CardHeader className={cn('px-4 py-2', isOpen && 'border-b border-border')}>
                <div className="flex w-full items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-expanded={isOpen}
                        aria-label={expandLabel}
                        className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-left text-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                        <span className="font-medium text-foreground">{row.problem_id}</span>
                        <span className="text-foreground">{row.submission_id}</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1.5 text-foreground">
                                    {row.verdictEmoji ? (
                                        <span
                                            aria-hidden
                                            className={row.verdict === 'Pending' ? 'animate-pulse' : undefined}
                                        >
                                            {row.verdictEmoji}
                                        </span>
                                    ) : null}
                                    {row.verdict}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">{row.verdictFullName}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-muted-foreground">{row.compiler_id}</span>
                            </TooltipTrigger>
                            <TooltipContent side="top">{row.compilerFullName}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-muted-foreground">{dayjs(row.time_inMs).fromNow()}</span>
                            </TooltipTrigger>
                            <TooltipContent side="top">{row.time_in}</TooltipContent>
                        </Tooltip>
                    </button>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="icon-sm" aria-label="View submission">
                                <Link href={row.submissionHref}>
                                    <EyeIcon />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">View submission</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                variant="outline"
                                size="icon-sm"
                                aria-label="Show debug information in full screen (opens in new window)"
                            >
                                <Link
                                    href={`${row.submissionHref}/debug/view`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Maximize2Icon />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Show in full screen</TooltipContent>
                    </Tooltip>
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={expandLabel}
                        className="ml-4 flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
                <CardContent className="p-4">
                    <ProblemCheckerDebugContent row={row} />
                </CardContent>
            ) : null}
        </Card>
    )
}

export function ProblemCheckingView() {
    const { problem_nm } = useParams<{ problem_nm: string }>()
    const [rows, setRows] = useState<ProblemSubmissionRow[] | null>(null)
    const [openKeys, setOpenKeys] = useState<Set<string>>(() => new Set())

    useEffect(() => {
        let cancelled = false
        setRows(null)
        setOpenKeys(new Set())

        void fetchProblemCheckerSubmissions(problem_nm).then((data) => {
            if (!cancelled) setRows(data)
        })

        return () => {
            cancelled = true
        }
    }, [problem_nm])

    if (rows === null) {
        return <SimpleSpinner size={64} className="pt-24" />
    }

    if (rows.length === 0) {
        return (
            <p className="w-full border p-12 text-center text-sm text-muted-foreground">
                No problem-checker submissions for this problem.
            </p>
        )
    }

    function toggle(rowKey: string) {
        setOpenKeys((current) => {
            const next = new Set(current)
            if (next.has(rowKey)) {
                next.delete(rowKey)
            } else {
                next.add(rowKey)
            }
            return next
        })
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-3">
                {rows.map((row) => (
                    <ProblemCheckerAccordionItem
                        key={row.rowKey}
                        row={row}
                        isOpen={openKeys.has(row.rowKey)}
                        onToggle={() => toggle(row.rowKey)}
                    />
                ))}
            </div>
        </TooltipProvider>
    )
}
