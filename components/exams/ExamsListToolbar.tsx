'use client'

import { ArrowDownWideNarrowIcon, FunnelIcon, HelpCircleIcon } from 'lucide-react'

import { ExamsHelpDialog } from '@/components/exams/ExamsHelpDialog'
import { SearchInput } from '@/components/SearchInput'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ExamsSortField, ExamsStatusFilter, ExamsTypeFilter } from '@/lib/exams'

type ExamsListToolbarProps = {
    searchQuery: string
    onSearchQueryChange: (value: string) => void
    typeFilter: ExamsTypeFilter
    onTypeFilterChange: (value: ExamsTypeFilter) => void
    statusFilter: ExamsStatusFilter
    onStatusFilterChange: (value: ExamsStatusFilter) => void
    sortField: ExamsSortField
    onSortFieldChange: (value: ExamsSortField) => void
    visibleCount?: number
    totalCount?: number
    showHelp?: boolean
    disabled?: boolean
}

export function ExamsListToolbar({
    searchQuery,
    onSearchQueryChange,
    typeFilter,
    onTypeFilterChange,
    statusFilter,
    onStatusFilterChange,
    sortField,
    onSortFieldChange,
    visibleCount,
    totalCount,
    showHelp = false,
    disabled = false,
}: ExamsListToolbarProps) {
    const showCountBadge = visibleCount !== undefined && totalCount !== undefined

    return (
        <TooltipProvider>
            <div className="flex flex-row items-center justify-end gap-2">
                {showCountBadge ? (
                    <Badge variant="outline" className="tabular-nums">
                        {visibleCount === totalCount ? visibleCount : `${visibleCount}/${totalCount}`}
                    </Badge>
                ) : null}
                <ButtonGroup>
                    {disabled ? (
                        <Button type="button" variant="outline" size="icon" aria-label="Filter exams" disabled>
                            <FunnelIcon aria-hidden />
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button type="button" variant="outline" size="icon" aria-label="Filter exams">
                                            <FunnelIcon aria-hidden />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top">Filter exams</TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Type</DropdownMenuLabel>
                                <DropdownMenuRadioGroup
                                    value={typeFilter}
                                    onValueChange={(value) => onTypeFilterChange(value as ExamsTypeFilter)}
                                >
                                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="exam">Exams</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="contest">Contests</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                <DropdownMenuRadioGroup
                                    value={statusFilter}
                                    onValueChange={(value) => onStatusFilterChange(value as ExamsStatusFilter)}
                                >
                                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="upcoming">Upcoming</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="in-progress">In progress</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="finished">Finished</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {disabled ? (
                        <Button type="button" variant="outline" size="icon" aria-label="Sort exams" disabled>
                            <ArrowDownWideNarrowIcon aria-hidden />
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button type="button" variant="outline" size="icon" aria-label="Sort exams">
                                            <ArrowDownWideNarrowIcon aria-hidden />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top">Sort exams</TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuRadioGroup
                                    value={sortField}
                                    onValueChange={(value) => onSortFieldChange(value as ExamsSortField)}
                                >
                                    <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="course">Course</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="instructor">Instructor</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </ButtonGroup>
                <SearchInput
                    showSearchIcon
                    value={searchQuery}
                    onChange={(event) => onSearchQueryChange(event.target.value)}
                    placeholder="Search…"
                    className="w-64 shrink-0"
                    aria-label="Search exams"
                    disabled={disabled}
                />
                {showHelp ? (
                    disabled ? (
                        <Button type="button" variant="outline" size="icon" aria-label="About exams" disabled>
                            <HelpCircleIcon aria-hidden />
                        </Button>
                    ) : (
                        <ExamsHelpDialog />
                    )
                ) : null}
            </div>
        </TooltipProvider>
    )
}
