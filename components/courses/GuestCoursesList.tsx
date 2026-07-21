'use client'

import { useMemo, useState } from 'react'
import { GraduationCap, SearchIcon } from 'lucide-react'

import { CourseCardIdentity, CourseCardShell, CourseStats } from '@/components/courses/CourseCard'
import { CoursesListToolbar } from '@/components/courses/CoursesListToolbar'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { TooltipProvider } from '@/components/ui/tooltip'
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

function GuestCourseCard({ course }: { course: GuestCourseRow }) {
    return (
        <CourseCardShell>
            {/* Every course here is public, so the Public badge would be noise. */}
            <CourseCardIdentity
                iconUrl={course.iconUrl}
                title={course.title}
                href={publicCourseHref(course.course_key)}
                ownerName={course.ownerName}
                isOfficial={course.isOfficial}
                stretched
            />
            <CourseStats problemCount={course.problemCount} />
        </CourseCardShell>
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
                <TooltipProvider>
                    <div className="flex flex-col gap-4">
                        {visibleCourses.map((course) => (
                            <GuestCourseCard key={course.course_key} course={course} />
                        ))}
                    </div>
                </TooltipProvider>
            )}
        </div>
    )
}
