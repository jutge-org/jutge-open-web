'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { SubmissionRow } from '@/lib/submissions'

type SortField = 'time_in' | 'problem_id' | 'submission_id' | 'verdict' | 'compiler'

type SubmissionsListProps = {
    rows: SubmissionRow[]
}

function compareRows(a: SubmissionRow, b: SubmissionRow, sortField: SortField): number {
    switch (sortField) {
        case 'time_in':
            return a.time_inMs - b.time_inMs
        case 'problem_id':
            return a.problem_id.localeCompare(b.problem_id, undefined, { sensitivity: 'base' })
        case 'submission_id':
            return a.submission_id.localeCompare(b.submission_id, undefined, { sensitivity: 'base' })
        case 'verdict':
            return a.verdict.localeCompare(b.verdict, undefined, { sensitivity: 'base' })
        case 'compiler':
            return a.compiler_id.localeCompare(b.compiler_id, undefined, { sensitivity: 'base' })
    }
}

export function SubmissionsList({ rows }: SubmissionsListProps) {
    const [textQuery, setTextQuery] = useState('')
    const [verdictFilter, setVerdictFilter] = useState('all')
    const [compilerFilter, setCompilerFilter] = useState('all')
    const [sortField, setSortField] = useState<SortField>('time_in')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    const verdictOptions = useMemo(() => {
        const verdicts = new Set<string>()
        for (const row of rows) {
            verdicts.add(row.verdict)
        }
        return [...verdicts].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    }, [rows])

    const compilerOptions = useMemo(() => {
        const compilers = new Map<string, string>()
        for (const row of rows) {
            compilers.set(row.compiler_id, row.compilerFullName)
        }
        return [...compilers.entries()].sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: 'base' }))
    }, [rows])

    const filteredRows = useMemo(() => {
        const query = textQuery.trim().toLowerCase()

        const filtered = rows.filter((row) => {
            if (verdictFilter !== 'all' && row.verdict !== verdictFilter) {
                return false
            }

            if (compilerFilter !== 'all' && row.compiler_id !== compilerFilter) {
                return false
            }

            if (!query) {
                return true
            }

            return (
                row.problem_id.toLowerCase().includes(query) ||
                row.problemTitle.toLowerCase().includes(query) ||
                row.submission_id.toLowerCase().includes(query) ||
                (row.annotation?.toLowerCase().includes(query) ?? false)
            )
        })

        const direction = sortDirection === 'asc' ? 1 : -1
        return filtered.sort((a, b) => compareRows(a, b, sortField) * direction)
    }, [rows, textQuery, verdictFilter, compilerFilter, sortField, sortDirection])

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-48">
                        <Label htmlFor="submissions-text-filter">Search</Label>
                        <Input
                            id="submissions-text-filter"
                            type="search"
                            placeholder="Filter by problem, id, or annotation…"
                            value={textQuery}
                            onChange={(event) => setTextQuery(event.target.value)}
                        />
                    </div>

                    <div className="flex min-w-0 flex-col gap-2 sm:w-44">
                        <Label htmlFor="submissions-verdict-filter">Verdict</Label>
                        <Select value={verdictFilter} onValueChange={setVerdictFilter}>
                            <SelectTrigger id="submissions-verdict-filter" className="w-full">
                                <SelectValue placeholder="All verdicts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All verdicts</SelectItem>
                                {verdictOptions.map((verdict) => (
                                    <SelectItem key={verdict} value={verdict}>
                                        {verdict}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2 sm:w-52">
                        <Label htmlFor="submissions-compiler-filter">Compiler</Label>
                        <Select value={compilerFilter} onValueChange={setCompilerFilter}>
                            <SelectTrigger id="submissions-compiler-filter" className="w-full">
                                <SelectValue placeholder="All compilers" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All compilers</SelectItem>
                                {compilerOptions.map(([compilerId, compilerName]) => (
                                    <SelectItem key={compilerId} value={compilerId}>
                                        {compilerName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2 sm:w-44">
                        <Label htmlFor="submissions-sort">Sort by</Label>
                        <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                            <SelectTrigger id="submissions-sort" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="time_in">Time</SelectItem>
                                <SelectItem value="problem_id">Problem</SelectItem>
                                <SelectItem value="submission_id">Submission id</SelectItem>
                                <SelectItem value="verdict">Verdict</SelectItem>
                                <SelectItem value="compiler">Compiler</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2 sm:w-36">
                        <Label htmlFor="submissions-sort-direction">Order</Label>
                        <Select value={sortDirection} onValueChange={(value) => setSortDirection(value as 'asc' | 'desc')}>
                            <SelectTrigger id="submissions-sort-direction" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Descending</SelectItem>
                                <SelectItem value="asc">Ascending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    {filteredRows.length.toLocaleString()} of {rows.length.toLocaleString()} submissions
                </p>

                <div className="rounded-xl border border-border bg-card shadow-xs">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10" />
                                <TableHead className="w-36">Problem</TableHead>
                                <TableHead className="w-28">Submission</TableHead>
                                <TableHead className="w-24">Verdict</TableHead>
                                <TableHead className="w-28">Compiler</TableHead>
                                <TableHead className="w-44">Time</TableHead>
                                <TableHead>Annotation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No submissions match the current filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRows.map((row) => (
                                    <TableRow key={row.submission_id}>
                                        <TableCell>
                                            {row.verdictEmoji ? (
                                                <span aria-hidden>{row.verdictEmoji}</span>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={row.problemHref} className="hover:text-primary hover:underline">
                                                        {row.problem_id}
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">{row.problemTitle}</TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{row.submission_id}</TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>{row.verdict}</span>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">{row.verdictFullName}</TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>{row.compiler_id}</span>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">{row.compilerFullName}</TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{row.time_in}</TableCell>
                                        <TableCell className="max-w-xs truncate text-sm" title={row.annotation ?? undefined}>
                                            {row.annotation ?? '—'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </TooltipProvider>
    )
}
