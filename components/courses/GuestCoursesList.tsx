'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { GraduationCap, SearchIcon, ShieldCheck, SignatureIcon } from 'lucide-react'

import { MarkdownText } from '@/components/general/MarkdownText'
import { CoursesListToolbar } from '@/components/courses/CoursesListToolbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
    type CoursesOfficialFilter,
    type CoursesSortField,
    filterAndSortCourses,
    type GuestCourseRow,
    publicCourseHref,
} from '@/lib/courses'

type GuestCoursesListProps = {
    courses: GuestCourseRow[]
}

function GuestCourseBadges({ course }: { course: GuestCourseRow }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {course.isOfficial ? (
                <Badge variant="outline" className="gap-1">
                    <ShieldCheck aria-hidden />
                    Official
                </Badge>
            ) : null}
        </div>
    )
}

function GuestCourseCard({ course }: { course: GuestCourseRow }) {
    return (
        <Link href={publicCourseHref(course.course_key)} className="block h-full">
            <Card className="flex h-full flex-col transition-[box-shadow,transform] duration-200 hover:border-primary/25 hover:shadow-md">
                <CardHeader className="">
                    <CardTitle className="line-clamp-2 text-base leading-snug hover:underline hover:underline-offset-4 hover:decoration-muted-foreground/50">
                        {course.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                        <SignatureIcon className="size-3 shrink-0" aria-hidden />
                        {course.ownerName}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                    {course.description ? (
                        <MarkdownText className="line-clamp-4">{course.description}</MarkdownText>
                    ) : null}
                    <div className="mt-auto">
                        <GuestCourseBadges course={course} />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export function GuestCoursesList({ courses }: GuestCoursesListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [officialFilter, setOfficialFilter] = useState<CoursesOfficialFilter>('all')
    const [sortField, setSortField] = useState<CoursesSortField>('title')

    const visibleCourses = useMemo(
        () => filterAndSortCourses(courses, searchQuery, officialFilter, sortField),
        [courses, officialFilter, searchQuery, sortField],
    )

    if (courses.length === 0) {
        return (
            <Empty className="border border-dashed border-border bg-muted/20 py-12">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <GraduationCap aria-hidden />
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
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleCourses.map((course) => (
                        <GuestCourseCard key={course.course_key} course={course} />
                    ))}
                </div>
            )}
        </div>
    )
}
