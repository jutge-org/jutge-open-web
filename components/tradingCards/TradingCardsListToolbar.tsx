'use client'

import { ArrowDownWideNarrowIcon, FunnelIcon } from 'lucide-react'

import { SearchInput } from '@/components/SearchInput'
import { TradingCardsHelpDialog } from '@/components/tradingCards/TradingCardsHelpDialog'
import { TradingCardsSubmitDialog } from '@/components/tradingCards/TradingCardsSubmitDialog'
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
import type { TradingCardsFamilyFilter, TradingCardsSortField } from '@/lib/tradingCards'

type TradingCardsListToolbarProps = {
    searchQuery: string
    onSearchQueryChange: (value: string) => void
    familyFilter: TradingCardsFamilyFilter
    onFamilyFilterChange: (value: TradingCardsFamilyFilter) => void
    families: string[]
    sortField: TradingCardsSortField
    onSortFieldChange: (value: TradingCardsSortField) => void
    visibleCount?: number
    totalCount?: number
    showHelp?: boolean
}

export function TradingCardsListToolbar({
    searchQuery,
    onSearchQueryChange,
    familyFilter,
    onFamilyFilterChange,
    families,
    sortField,
    onSortFieldChange,
    visibleCount,
    totalCount,
    showHelp = false,
}: TradingCardsListToolbarProps) {
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-label="Filter collectible cards"
                                    >
                                        <FunnelIcon aria-hidden />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Filter collectible cards</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="max-h-72 w-48 overflow-y-auto">
                            <DropdownMenuLabel>Family</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={familyFilter}
                                onValueChange={(value) => onFamilyFilterChange(value as TradingCardsFamilyFilter)}
                            >
                                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                {families.map((family) => (
                                    <DropdownMenuRadioItem key={family} value={family}>
                                        {family}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-label="Sort collectible cards"
                                    >
                                        <ArrowDownWideNarrowIcon aria-hidden />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Sort collectible cards</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={sortField}
                                onValueChange={(value) => {
                                    if (value === 'shuffle') {
                                        return
                                    }
                                    onSortFieldChange(value as TradingCardsSortField)
                                }}
                            >
                                <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="family">Family</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="shuffle" onSelect={() => onSortFieldChange('shuffle')}>
                                    Shuffle
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
                <SearchInput
                    showSearchIcon
                    value={searchQuery}
                    onChange={(event) => onSearchQueryChange(event.target.value)}
                    placeholder="Search…"
                    className="w-64 shrink-0"
                    aria-label="Search collectible cards"
                />
                <TradingCardsSubmitDialog />
                {showHelp ? <TradingCardsHelpDialog /> : null}
            </div>
        </TooltipProvider>
    )
}
