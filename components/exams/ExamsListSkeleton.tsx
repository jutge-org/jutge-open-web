'use client'

import { ExamListCardSkeleton } from '@/components/exams/ExamListCardSkeleton'
import { ExamsListToolbar } from '@/components/exams/ExamsListToolbar'

export function ExamsListSkeleton() {
    return (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading exams">
            <ExamsListToolbar
                disabled
                searchQuery=""
                onSearchQueryChange={() => {}}
                typeFilter="all"
                onTypeFilterChange={() => {}}
                statusFilter="all"
                onStatusFilterChange={() => {}}
                sortField="date"
                onSortFieldChange={() => {}}
                showHelp
            />
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }, (_, index) => (
                    <ExamListCardSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}
