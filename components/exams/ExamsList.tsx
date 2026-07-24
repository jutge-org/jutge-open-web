'use client'

import { useMemo, useState } from 'react'
import { ChevronDownIcon, PenLineIcon, SearchIcon } from 'lucide-react'

import { ExamListCard } from '@/components/exams/ExamListCard'
import { ExamsListToolbar } from '@/components/exams/ExamsListToolbar'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
    filterAndSortExams,
    partitionExamsByRecency,
    type ExamRow,
    type ExamsSortField,
    type ExamsStatusFilter,
    type ExamsTypeFilter,
} from '@/lib/exams'
import { cn } from '@/lib/utils'

type ExamsListProps = {
    rows: ExamRow[]
}

export function ExamsList({ rows }: ExamsListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<ExamsTypeFilter>('all')
    const [statusFilter, setStatusFilter] = useState<ExamsStatusFilter>('all')
    const [sortField, setSortField] = useState<ExamsSortField>('date')
    // null → follow the default (open only when there are no upcoming exams); a boolean is the
    // user's explicit choice.
    const [pastOpenOverride, setPastOpenOverride] = useState<boolean | null>(null)

    const { upcoming, past, visibleCount } = useMemo(() => {
        const visibleRows = filterAndSortExams(rows, searchQuery, typeFilter, statusFilter, sortField)
        const groups = partitionExamsByRecency(visibleRows)
        // Upcoming reads best soonest-first; past stays newest-first (as date sort already yields).
        const upcomingOrdered =
            sortField === 'date'
                ? [...groups.upcoming].sort((a, b) => a.exp_time_startMs - b.exp_time_startMs)
                : groups.upcoming
        return { upcoming: upcomingOrdered, past: groups.past, visibleCount: visibleRows.length }
    }, [rows, searchQuery, sortField, statusFilter, typeFilter])

    if (rows.length === 0) {
        return (
            <Empty className="rounded-2xl border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PenLineIcon aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>No exams yet</EmptyTitle>
                    <EmptyDescription>
                        Exams and contests linked to your account will appear here when they are scheduled.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    const pastOpen = pastOpenOverride ?? upcoming.length === 0

    return (
        <div className="flex flex-col gap-6">
            <ExamsListToolbar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortField={sortField}
                onSortFieldChange={setSortField}
                visibleCount={visibleCount}
                totalCount={rows.length}
                showHelp
            />

            {visibleCount === 0 ? (
                <Empty className="border border-dashed border-border bg-muted/20 py-12">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <SearchIcon aria-hidden />
                        </EmptyMedia>
                        <EmptyTitle>No matching exams</EmptyTitle>
                        <EmptyDescription>
                            Try a different search term, adjust filters, or clear the search box.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <TooltipProvider>
                    {upcoming.length > 0 ? (
                        <section className="flex flex-col gap-3">
                            <SectionHeading title="Upcoming" count={upcoming.length} />
                            <div className="flex flex-col gap-4">
                                {upcoming.map((row) => (
                                    <ExamListCard key={row.exam_key} row={row} tone="upcoming" />
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {past.length > 0 ? (
                        <Collapsible
                            open={pastOpen}
                            onOpenChange={setPastOpenOverride}
                            className="flex flex-col gap-3"
                        >
                            <CollapsibleTrigger className="group flex items-center gap-2 rounded-md text-sm font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <ChevronDownIcon
                                    className="size-4 shrink-0 transition-transform group-data-[state=closed]:-rotate-90"
                                    aria-hidden
                                />
                                Past
                                <Badge variant="outline" className="tabular-nums">
                                    {past.length}
                                </Badge>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="flex flex-col gap-4">
                                {past.map((row) => (
                                    <ExamListCard key={row.exam_key} row={row} tone="past" />
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    ) : null}
                </TooltipProvider>
            )}
        </div>
    )
}

function SectionHeading({ title, count, className }: { title: string; count: number; className?: string }) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</h2>
            <Badge variant="outline" className="tabular-nums">
                {count}
            </Badge>
        </div>
    )
}
