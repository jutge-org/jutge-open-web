'use client'

import { Columns3Icon, SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    PROBLEMS_COLUMN_LABELS,
    type ProblemsColumnField,
    type ProblemsColumnVisibility,
} from '@/lib/problems'

type ProblemsListToolbarProps = {
    searchQuery: string
    onSearchQueryChange: (value: string) => void
    columnVisibility: ProblemsColumnVisibility
    onColumnVisibilityChange: (field: ProblemsColumnField, visible: boolean) => void
    showStatusColumn?: boolean
    visibleCount?: number
    totalCount?: number
}

const TOGGLEABLE_COLUMNS: ProblemsColumnField[] = ['problem_nm', 'title', 'author', 'language_ids', 'type']

export function ProblemsListToolbar({
    searchQuery,
    onSearchQueryChange,
    columnVisibility,
    onColumnVisibilityChange,
    showStatusColumn = false,
    visibleCount,
    totalCount,
}: ProblemsListToolbarProps) {
    const columns = showStatusColumn ? (['status', ...TOGGLEABLE_COLUMNS] as ProblemsColumnField[]) : TOGGLEABLE_COLUMNS
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
                                    <Button type="button" variant="outline" size="icon" aria-label="Toggle columns">
                                        <Columns3Icon aria-hidden />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Columns</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Columns</DropdownMenuLabel>
                            {columns.map((field) => (
                                <DropdownMenuCheckboxItem
                                    key={field}
                                    checked={columnVisibility[field]}
                                    onCheckedChange={(checked) => onColumnVisibilityChange(field, checked === true)}
                                >
                                    {PROBLEMS_COLUMN_LABELS[field]}
                                </DropdownMenuCheckboxItem>
                            ))}
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
                        aria-label="Search problems"
                    />
                </div>
            </div>
        </TooltipProvider>
    )
}
