'use client'

import { ArrowDownWideNarrowIcon, FunnelIcon, SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { CoursesOfficialFilter, CoursesSortField } from '@/lib/courses'
import { ButtonGroup } from '../ui/button-group'

type CoursesListToolbarProps = {
    searchQuery: string
    onSearchQueryChange: (value: string) => void
    officialFilter: CoursesOfficialFilter
    onOfficialFilterChange: (value: CoursesOfficialFilter) => void
    sortField: CoursesSortField
    onSortFieldChange: (value: CoursesSortField) => void
    visibleCount?: number
    totalCount?: number
}

export function CoursesListToolbar({
    searchQuery,
    onSearchQueryChange,
    officialFilter,
    onOfficialFilterChange,
    sortField,
    onSortFieldChange,
    visibleCount,
    totalCount,
}: CoursesListToolbarProps) {
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
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="outline" size="icon" aria-label="Filter courses">
                                        <FunnelIcon aria-hidden />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Filter courses</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Official</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={officialFilter}
                                onValueChange={(value) => onOfficialFilterChange(value as CoursesOfficialFilter)}
                            >
                                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="official">Official</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="unofficial">Non-official</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="outline" size="icon" aria-label="Sort courses">
                                        <ArrowDownWideNarrowIcon aria-hidden />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Sort courses</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={sortField}
                                onValueChange={(value) => onSortFieldChange(value as CoursesSortField)}
                            >
                                <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="author">Author</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
                <div className="relative w-64">
                    <SearchIcon
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                    />
                    <Input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => onSearchQueryChange(event.target.value)}
                        placeholder="Search…"
                        className="pl-9"
                        aria-label="Search courses"
                    />
                </div>
            </div>
        </TooltipProvider>
    )
}
