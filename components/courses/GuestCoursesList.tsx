'use client'

import { useEffect, useMemo, useState } from 'react'
import { GraduationCapIcon, SearchIcon, ShieldCheckIcon, SignatureIcon } from 'lucide-react'

import { CourseGuestLists } from '@/components/courses/CourseGuestLists'
import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { CoursesListToolbar } from '@/components/courses/CoursesListToolbar'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
    type CoursesOfficialFilter,
    type CoursesSortField,
    filterAndSortCourses,
    type GuestCourseRow,
} from '@/lib/courses'

type GuestCoursesListProps = {
    courses: GuestCourseRow[]
}

function GuestCourseAccordionItem({ course }: { course: GuestCourseRow }) {
    return (
        <AccordionItem
            value={course.course_key}
            id={course.course_key}
            className="rounded-xl border border-border bg-card px-3 shadow-sm"
        >
            <AccordionTrigger className="items-center gap-3 rounded-none border-0 py-2.5 hover:no-underline">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CourseIconImage iconUrl={course.iconUrl} size="sm" />
                    <div className="min-w-0 flex-1 text-left">
                        <div className="truncate font-medium text-foreground">{course.title}</div>
                        <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex min-w-0 items-center gap-1">
                                <SignatureIcon className="size-3 shrink-0" aria-hidden />
                                <span className="truncate">{course.ownerName}</span>
                            </span>
                            {course.isOfficial ? (
                                <Badge
                                    variant="outline"
                                    className="hidden h-5 gap-1 px-1.5 text-[11px] font-normal sm:flex"
                                >
                                    <ShieldCheckIcon aria-hidden />
                                    Official
                                </Badge>
                            ) : null}
                        </div>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 pb-3">
                {course.description ? (
                    <div>
                        <h2 className="mt-2 text-sm font-medium text-foreground">Description</h2>
                        <div className="mt-1.5 text-sm text-muted-foreground">
                            <MarkdownText>{course.description}</MarkdownText>
                        </div>
                    </div>
                ) : null}
                <CourseGuestLists lists={course.lists} problemCount={course.problemCount} />
            </AccordionContent>
        </AccordionItem>
    )
}

export function GuestCoursesList({ courses }: GuestCoursesListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [officialFilter, setOfficialFilter] = useState<CoursesOfficialFilter>('all')
    const [sortField, setSortField] = useState<CoursesSortField>('title')
    const [openItems, setOpenItems] = useState<string[]>([])

    const visibleCourses = useMemo(
        () => filterAndSortCourses(courses, searchQuery, officialFilter, sortField),
        [courses, officialFilter, searchQuery, sortField],
    )

    useEffect(() => {
        const hash = window.location.hash.slice(1)
        if (!hash) return
        if (!courses.some((course) => course.course_key === hash)) return
        setOpenItems((current) => (current.includes(hash) ? current : [...current, hash]))
        requestAnimationFrame(() => {
            document.getElementById(hash)?.scrollIntoView({ block: 'nearest' })
        })
    }, [courses])

    if (courses.length === 0) {
        return (
            <Empty className="border border-dashed border-border bg-muted/20 py-12">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <GraduationCapIcon aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>No public courses</EmptyTitle>
                    <EmptyDescription>
                        There are no public courses available right now. Check back later or sign in to browse your
                        courses.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <CoursesListToolbar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                officialFilter={officialFilter}
                onOfficialFilterChange={setOfficialFilter}
                sortField={sortField}
                onSortFieldChange={setSortField}
                visibleCount={visibleCourses.length}
                totalCount={courses.length}
            />

            {visibleCourses.length === 0 ? (
                <Empty className="border border-dashed border-border bg-muted/20 py-12">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <SearchIcon aria-hidden />
                        </EmptyMedia>
                        <EmptyTitle>No matching courses</EmptyTitle>
                        <EmptyDescription>
                            Try a different search term, adjust filters, or clear the search box.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="gap-4">
                    {visibleCourses.map((course) => (
                        <GuestCourseAccordionItem key={course.course_key} course={course} />
                    ))}
                </Accordion>
            )}
        </div>
    )
}
