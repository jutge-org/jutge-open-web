'use client'

import { useMemo, useState } from 'react'
import {
    ArrowDownWideNarrowIcon,
    Globe,
    GraduationCap,
    FunnelIcon,
    SearchIcon,
    ShieldCheck,
    SignatureIcon,
} from 'lucide-react'

import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import type { GuestCourseRow } from '@/lib/courses'

type GuestCoursesListProps = {
    courses: GuestCourseRow[]
}

type SortField = 'title' | 'author'
type OfficialFilter = 'all' | 'official' | 'unofficial'

function matchesSearch(course: GuestCourseRow, query: string): boolean {
    if (!query) {
        return true
    }

    const haystack = [course.title, course.ownerName, course.description].join(' ').toLowerCase()
    return haystack.includes(query)
}

function matchesOfficialFilter(course: GuestCourseRow, filter: OfficialFilter): boolean {
    switch (filter) {
        case 'all':
            return true
        case 'official':
            return course.isOfficial
        case 'unofficial':
            return !course.isOfficial
    }
}

function compareCourses(a: GuestCourseRow, b: GuestCourseRow, sortField: SortField): number {
    switch (sortField) {
        case 'author':
            return a.ownerName.localeCompare(b.ownerName, undefined, { sensitivity: 'base' })
        case 'title':
            return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    }
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
            {course.isPublic ? (
                <Badge variant="outline" className="gap-1">
                    <Globe aria-hidden />
                    Public
                </Badge>
            ) : null}
        </div>
    )
}

function GuestCourseCard({ course }: { course: GuestCourseRow }) {
    return (
        <Card className="flex h-full flex-col transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader>
                <CardTitle className="line-clamp-2 text-base leading-snug">{course.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                    <SignatureIcon className="size-3 shrink-0" aria-hidden />
                    {course.ownerName}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
                {course.description ? (
                    <MarkdownText className="line-clamp-4">{course.description}</MarkdownText>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No description provided.</p>
                )}
                <div className="mt-auto">
                    <GuestCourseBadges course={course} />
                </div>
            </CardContent>
        </Card>
    )
}

export function GuestCoursesList({ courses }: GuestCoursesListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [officialFilter, setOfficialFilter] = useState<OfficialFilter>('all')
    const [sortField, setSortField] = useState<SortField>('title')

    const visibleCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        return courses
            .filter((course) => matchesSearch(course, query) && matchesOfficialFilter(course, officialFilter))
            .sort((a, b) => compareCourses(a, b, sortField))
    }, [courses, officialFilter, searchQuery, sortField])

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
            <div className="flex gap-2 flex-row justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" size="icon" aria-label="Filter courses">
                            <FunnelIcon aria-hidden />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Official</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={officialFilter}
                            onValueChange={(value) => setOfficialFilter(value as OfficialFilter)}
                        >
                            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="official">Official</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="unofficial">Non-official</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" size="icon" aria-label="Sort courses">
                            <ArrowDownWideNarrowIcon aria-hidden />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={sortField}
                            onValueChange={(value) => setSortField(value as SortField)}
                        >
                            <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="author">Author</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative w-64">
                    <SearchIcon
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                    />
                    <Input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search…"
                        className="pl-9"
                        aria-label="Search courses"
                    />
                </div>
            </div>

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
