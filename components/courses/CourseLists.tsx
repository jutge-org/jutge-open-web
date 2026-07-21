'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { ChevronDownIcon, ChevronUpIcon, EditIcon, EllipsisVerticalIcon } from 'lucide-react'

import { CourseListItemsTable } from '@/components/courses/CourseListItemsTable'
import { ProblemCountBadge } from '@/components/courses/ProblemCountBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { LastSubmissionInfo } from '@/lib/submissions'
import type { AbstractStatus, Language } from '@/lib/jutge_api_client'
import { instructorListPropertiesHref, tallyProblemStatuses, type ProblemStatusCounts } from '@/lib/courses'
import { useCourseListAccordionPreference } from '@/hooks/use-course-list-accordion-preference'
import { useRecents } from '@/components/RecentsProvider'
import type { CourseListData, CourseListItemRow } from '@/lib/data/lists'
import { cn } from '@/lib/utils'

import type { SupervisionContext } from '@/lib/supervision'

type CourseListsProps = {
    courseKey: string
    lists: CourseListData[]
    languages: Record<string, Language>
    statuses?: Record<string, AbstractStatus>
    lastSubmissions?: Record<string, LastSubmissionInfo>
    supervisionContext?: SupervisionContext
}

function isProblemRow(row: CourseListItemRow): row is Extract<CourseListItemRow, { kind: 'problem' }> {
    return row.kind === 'problem'
}

function computeListProblemCounts(
    items: CourseListItemRow[],
    statuses?: Record<string, AbstractStatus>,
): ProblemStatusCounts {
    return tallyProblemStatuses(
        items.filter(isProblemRow).map((problem) => problem.problem_nm),
        statuses,
    )
}

function ListProblemCountBadges({ counts, className }: { counts: ProblemStatusCounts; className?: string }) {
    return (
        <div className={cn('flex items-center gap-1.5', className)}>
            {counts.ok > 0 ? <ProblemCountBadge tone="ok" count={counts.ok} /> : null}
            {counts.scored > 0 ? <ProblemCountBadge tone="scored" count={counts.scored} /> : null}
            {counts.ko > 0 ? <ProblemCountBadge tone="ko" count={counts.ko} /> : null}
            {counts.total > 0 ? <ProblemCountBadge tone="total" count={counts.total} className="ml-2" /> : null}
        </div>
    )
}

type CourseListOwnerMenuProps = {
    listNm: string
    title: string
}

function CourseListOwnerMenu({ listNm, title }: CourseListOwnerMenuProps) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                            aria-label={`Actions for ${title}`}
                        >
                            <EllipsisVerticalIcon className="size-4" aria-hidden />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">List actions</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={instructorListPropertiesHref(listNm)}>
                        <EditIcon aria-hidden />
                        Edit
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function CourseLists({
    courseKey,
    lists,
    languages,
    statuses,
    lastSubmissions,
    supervisionContext,
}: CourseListsProps) {
    const listNames = useMemo(() => lists.map((list) => list.list_nm), [lists])
    const [openItems, setOpenItems] = useCourseListAccordionPreference(courseKey, listNames)
    const { recordList } = useRecents()

    const countsByList = useMemo(
        () => new Map(lists.map((list) => [list.list_nm, computeListProblemCounts(list.items, statuses)])),
        [lists, statuses],
    )

    function toggleList(listNm: string) {
        // Expanding a list is the closest thing students have to visiting one. Not recorded while
        // supervising, where the lists on screen belong to the student being looked at.
        if (!openItems.includes(listNm) && !supervisionContext) {
            const list = lists.find((entry) => entry.list_nm === listNm)
            recordList({
                listNm,
                title: list?.title ?? listNm,
                courseKey,
                accessedAt: Date.now(),
            })
        }

        setOpenItems((current) =>
            current.includes(listNm) ? current.filter((item) => item !== listNm) : [...current, listNm],
        )
    }

    if (lists.length === 0) {
        return null
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-3">
                {lists.map((list) => {
                    const counts = countsByList.get(list.list_nm) ?? { total: 0, ok: 0, scored: 0, ko: 0 }
                    const isOpen = openItems.includes(list.list_nm)
                    const expandLabel = isOpen ? `Collapse ${list.title}` : `Expand ${list.title}`

                    return (
                        <Card
                            key={list.list_nm}
                            className="gap-0 overflow-hidden border border-border py-0 shadow-sm ring-0"
                        >
                            <CardHeader
                                className={cn(
                                    'flex items-center bg-card px-3 py-2 [.border-b]:pb-2',
                                    isOpen && 'border-b border-border',
                                )}
                            >
                                <div className="flex w-full items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleList(list.list_nm)}
                                        aria-expanded={isOpen}
                                        className="flex min-w-0 flex-1 items-center text-left"
                                    >
                                        <CardTitle className="text-base font-semibold">{list.title}</CardTitle>
                                    </button>
                                    {list.isOwner ? (
                                        <CourseListOwnerMenu listNm={list.list_nm} title={list.title} />
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => toggleList(list.list_nm)}
                                        aria-label={expandLabel}
                                        className="flex shrink-0 items-center gap-1.5"
                                    >
                                        <ListProblemCountBadges counts={counts} />
                                        {isOpen ? (
                                            <ChevronUpIcon
                                                className="ml-2 size-4 shrink-0 text-muted-foreground"
                                                aria-hidden
                                            />
                                        ) : (
                                            <ChevronDownIcon
                                                className="ml-2 size-4 shrink-0 text-muted-foreground"
                                                aria-hidden
                                            />
                                        )}
                                    </button>
                                </div>
                            </CardHeader>
                            {isOpen ? (
                                <CardContent className="p-0!">
                                    {list.items.length === 0 ? (
                                        <p className="px-4 py-3 text-sm text-muted-foreground italic">
                                            This list has no items.
                                        </p>
                                    ) : (
                                        <CourseListItemsTable
                                            items={list.items}
                                            languages={languages}
                                            statuses={statuses}
                                            lastSubmissions={lastSubmissions}
                                            supervisionContext={supervisionContext}
                                        />
                                    )}
                                </CardContent>
                            ) : null}
                        </Card>
                    )
                })}
            </div>
        </TooltipProvider>
    )
}
