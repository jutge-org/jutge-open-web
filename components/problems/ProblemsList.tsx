'use client'

import { useMemo, useState } from 'react'

import { ProblemTypeIcon, ProblemTypeOption } from '@/components/problems/ProblemTypeIcon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Language } from '@/lib/jutge_api_client'
import type { ProblemRow } from '@/services/queries/problems'
import {
    ArrowDownAZ,
    ArrowDownWideNarrow,
    Calendar,
    CalendarClock,
    CheckIcon,
    Dices,
    Key,
    ListFilter,
    PenLine,
    Search,
} from 'lucide-react'
import Link from 'next/link'

type SortField = 'title' | 'author' | 'problem_nm' | 'created_at' | 'updated_at' | 'shuffle'

type ProblemsListProps = {
    problems: ProblemRow[]
    languages: Record<string, Language>
}

function languageLabel(languageId: string, languages: Record<string, Language>): string {
    const language = languages[languageId]
    return language ? `${language.own_name} (${languageId})` : languageId
}

function toSortableTime(value: string | number): number {
    if (typeof value === 'number') {
        return value
    }
    const parsed = Date.parse(String(value))
    return Number.isNaN(parsed) ? 0 : parsed
}

function seededShuffle<T>(items: T[], seed: number): T[] {
    const result = [...items]
    let state = seed || 1

    const random = () => {
        state = (state * 16807) % 2147483647
        return (state - 1) / 2147483646
    }

    for (let index = result.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1))
        ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
    }

    return result
}

export function ProblemsList({ problems, languages }: ProblemsListProps) {
    const [textQuery, setTextQuery] = useState('')
    const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(() => new Set())
    const [selectedTypes, setSelectedTypes] = useState<Set<string>>(() => new Set())
    const [sortField, setSortField] = useState<SortField>('title')
    const [shuffleSeed, setShuffleSeed] = useState(0)

    const hasActiveFilters = selectedLanguages.size > 0 || selectedTypes.size > 0

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
            if (
                selectedLanguages.size > 0 &&
                !problem.language_ids.some((languageId) => selectedLanguages.has(languageId))
            ) {
                return false
            }

            if (selectedTypes.size > 0 && (!problem.type || !selectedTypes.has(problem.type))) {
                return false
            }

            if (!query) {
                return true
            }

            return (
                problem.problem_nm.toLowerCase().includes(query) ||
                problem.title.toLowerCase().includes(query) ||
                (problem.author?.toLowerCase().includes(query) ?? false)
            )
        })

        if (sortField === 'shuffle') {
            return seededShuffle(filtered, shuffleSeed)
        }

        return filtered.sort((a, b) => {
            if (sortField === 'created_at' || sortField === 'updated_at') {
                return toSortableTime(b[sortField]) - toSortableTime(a[sortField])
            }

            const left = (a[sortField] ?? '').toString()
            const right = (b[sortField] ?? '').toString()
            return left.localeCompare(right, undefined, { sensitivity: 'base' })
        })
    }, [problems, textQuery, selectedLanguages, selectedTypes, sortField, shuffleSeed])

    function toggleLanguage(languageId: string) {
        setSelectedLanguages((current) => {
            const next = new Set(current)
            if (next.has(languageId)) {
                next.delete(languageId)
            } else {
                next.add(languageId)
            }
            return next
        })
    }

    function toggleType(type: string) {
        setSelectedTypes((current) => {
            const next = new Set(current)
            if (next.has(type)) {
                next.delete(type)
            } else {
                next.add(type)
            }
            return next
        })
    }

    function handleSortChange(value: SortField) {
        setSortField(value)
        if (value === 'shuffle') {
            setShuffleSeed((seed) => seed + 1)
        }
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Filter problems"
                                className={cn(hasActiveFilters && 'border-primary text-primary')}
                            >
                                <ListFilter className="size-4" aria-hidden />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-h-80 w-56 overflow-y-auto">
                            <DropdownMenuLabel>Languages</DropdownMenuLabel>
                            {languageOptions.map((languageId) => (
                                <DropdownMenuCheckboxItem
                                    key={languageId}
                                    checked={selectedLanguages.has(languageId)}
                                    onCheckedChange={() => toggleLanguage(languageId)}
                                    onSelect={(event) => event.preventDefault()}
                                >
                                    {languageLabel(languageId, languages)}
                                </DropdownMenuCheckboxItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Types</DropdownMenuLabel>
                            {typeOptions.map((type) => (
                                <DropdownMenuCheckboxItem
                                    key={type}
                                    checked={selectedTypes.has(type)}
                                    onCheckedChange={() => toggleType(type)}
                                    onSelect={(event) => event.preventDefault()}
                                >
                                    <ProblemTypeOption type={type} />
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline" size="icon" aria-label="Sort problems">
                                <ArrowDownWideNarrow className="size-4" aria-hidden />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-44">
                            <DropdownMenuRadioGroup
                                value={sortField === 'shuffle' ? '' : sortField}
                                onValueChange={(value) => handleSortChange(value as SortField)}
                            >
                                <DropdownMenuRadioItem value="title">
                                    <ArrowDownAZ className="size-4" aria-hidden />
                                    Name
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="author">
                                    <PenLine className="size-4" aria-hidden />
                                    Author
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="problem_nm">
                                    <Key className="size-4" aria-hidden />
                                    Key
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="created_at">
                                    <Calendar className="size-4" aria-hidden />
                                    Creation time
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="updated_at">
                                    <CalendarClock className="size-4" aria-hidden />
                                    Update time
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleSortChange('shuffle')}>
                                <Dices className="size-4" aria-hidden />
                                Shuffle
                                {sortField === 'shuffle' ? <CheckIcon className="ml-auto size-4" aria-hidden /> : null}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="relative w-full max-w-56">
                        <Search
                            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                        />
                        <Input
                            id="problems-text-filter"
                            type="search"
                            placeholder="Search..."
                            value={textQuery}
                            onChange={(event) => setTextQuery(event.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-xs">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-28">Problem</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="w-48">Languages</TableHead>
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
