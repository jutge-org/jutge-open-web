'use client'

import { useMemo, useState } from 'react'

import { ProblemTypeIcon, ProblemTypeOption } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Language } from '@/lib/jutge_api_client'
import type { ProblemRow } from '@/services/queries/problems'
import Link from 'next/link'

type SortField = 'problem_nm' | 'title'

type ProblemsListProps = {
    problems: ProblemRow[]
    languages: Record<string, Language>
}

function languageLabel(languageId: string, languages: Record<string, Language>): string {
    const language = languages[languageId]
    return language ? `${language.own_name} (${languageId})` : languageId
}

export function ProblemsList({ problems, languages }: ProblemsListProps) {
    const [textQuery, setTextQuery] = useState('')
    const [languageFilter, setLanguageFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [sortField, setSortField] = useState<SortField>('problem_nm')

    const languageOptions = useMemo(() => {
        const ids = new Set<string>()
        for (const problem of problems) {
            for (const languageId of problem.language_ids) {
                ids.add(languageId)
            }
        }
        return [...ids].sort((a, b) => languageLabel(a, languages).localeCompare(languageLabel(b, languages)))
    }, [problems, languages])

    const typeOptions = useMemo(() => {
        const types = new Set<string>()
        for (const problem of problems) {
            if (problem.type) {
                types.add(problem.type)
            }
        }
        return [...types].sort()
    }, [problems])

    const filteredProblems = useMemo(() => {
        const query = textQuery.trim().toLowerCase()

        const filtered = problems.filter((problem) => {
            if (languageFilter !== 'all' && !problem.language_ids.includes(languageFilter)) {
                return false
            }

            if (typeFilter !== 'all' && problem.type !== typeFilter) {
                return false
            }

            if (!query) {
                return true
            }

            return problem.problem_nm.toLowerCase().includes(query) || problem.title.toLowerCase().includes(query)
        })

        return filtered.sort((a, b) => a[sortField].localeCompare(b[sortField], undefined, { sensitivity: 'base' }))
    }, [problems, textQuery, languageFilter, typeFilter, sortField])

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-48">
                        <Label htmlFor="problems-text-filter">Search</Label>
                        <Input
                            id="problems-text-filter"
                            type="search"
                            placeholder="Filter by id or title…"
                            value={textQuery}
                            onChange={(event) => setTextQuery(event.target.value)}
                        />
                    </div>

                    <div className="flex min-w-0 flex-col gap-2 sm:w-52">
                        <Label htmlFor="problems-language-filter">Language</Label>
                        <Select value={languageFilter} onValueChange={setLanguageFilter}>
                            <SelectTrigger id="problems-language-filter" className="w-full">
                                <SelectValue placeholder="All languages" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All languages</SelectItem>
                                {languageOptions.map((languageId) => (
                                    <SelectItem key={languageId} value={languageId}>
                                        {languageLabel(languageId, languages)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2 sm:w-44">
                        <Label htmlFor="problems-type-filter">Type</Label>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger id="problems-type-filter" className="w-full">
                                <SelectValue placeholder="All types">
                                    {typeFilter === 'all' ? 'All types' : <ProblemTypeOption type={typeFilter} />}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                {typeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        <ProblemTypeOption type={type} />
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2 sm:w-44">
                        <Label htmlFor="problems-sort">Sort by</Label>
                        <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                            <SelectTrigger id="problems-sort" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="problem_nm">Problem id</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    {filteredProblems.length.toLocaleString()} of {problems.length.toLocaleString()} problems
                </p>

                <div className="rounded-xl border border-border bg-card shadow-xs">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-28">Problem</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="w-36">Languages</TableHead>
                                <TableHead className="w-24">Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProblems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No problems match the current filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProblems.map((problem) => (
                                    <TableRow key={problem.problem_nm}>
                                        <TableCell className="tabular-nums text-sm">
                                            <Link href={`/problems/${problem.problem_nm}`}>{problem.problem_nm}</Link>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate" title={problem.title}>
                                            {problem.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {problem.language_ids.map((languageId) => (
                                                    <Tooltip key={languageId}>
                                                        <TooltipTrigger asChild>
                                                            <Badge variant="outline">{languageId}</Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="left">
                                                            {languages[languageId]?.eng_name ?? languageId}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {problem.type ? (
                                                <ProblemTypeIcon
                                                    type={problem.type}
                                                    className="text-muted-foreground translate-y-1"
                                                />
                                            ) : (
                                                '—'
                                            )}
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
