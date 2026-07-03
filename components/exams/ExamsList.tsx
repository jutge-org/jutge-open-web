'use client'

import { useMemo, useState } from 'react'
import { PenLineIcon, SearchIcon } from 'lucide-react'

import { ExamListCard } from '@/components/exams/ExamListCard'
import { ExamsListToolbar } from '@/components/exams/ExamsListToolbar'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
    filterAndSortExams,
    type ExamRow,
    type ExamsSortField,
    type ExamsStatusFilter,
    type ExamsTypeFilter,
} from '@/lib/exams'

type ExamsListProps = {
    rows: ExamRow[]
}

export function ExamsList({ rows }: ExamsListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<ExamsTypeFilter>('all')
    const [statusFilter, setStatusFilter] = useState<ExamsStatusFilter>('all')
    const [sortField, setSortField] = useState<ExamsSortField>('date')

    const visibleRows = useMemo(
        () => filterAndSortExams(rows, searchQuery, typeFilter, statusFilter, sortField),
        [rows, searchQuery, sortField, statusFilter, typeFilter],
    )

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

    return (
        <div className="flex flex-col gap-4">
            <ExamsListToolbar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortField={sortField}
                onSortFieldChange={setSortField}
                visibleCount={visibleRows.length}
                totalCount={rows.length}
            />

            {visibleRows.length === 0 ? (
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
                    <div className="flex flex-col gap-4">
                        {visibleRows.map((row) => (
                            <ExamListCard key={row.exam_nm} row={row} />
                        ))}
                    </div>
                </TooltipProvider>
            )}
        </div>
    )
}
