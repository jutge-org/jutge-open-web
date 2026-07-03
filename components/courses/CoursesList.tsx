'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import {
    ArchiveIcon,
    ArchiveRestoreIcon,
    BookOpenCheckIcon,
    EditIcon,
    Globe,
    GraduationCap,
    GraduationCapIcon,
    Loader2,
    LogOutIcon,
    EllipsisVerticalIcon,
    SearchIcon,
    ShieldCheck,
    SignatureIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

import { archiveCourseAction, enrollCourseAction, unarchiveCourseAction, unenrollCourseAction } from '@/actions/courses'
import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import { CoursesListToolbar } from '@/components/courses/CoursesListToolbar'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
    courseActionSuccessMessage,
    courseHref,
    instructorCoursePropertiesHref,
    type CourseRow,
    type CourseStudentAction,
    type CoursesInstructorFilter,
    type CoursesOfficialFilter,
    type CoursesSortField,
    type CoursesTab,
    filterAndSortCourses,
} from '@/lib/courses'
import { cn } from '@/lib/utils'

const UNENROLL_CONFIRMATION =
    'Please take into account that, after unenrolling from it, your instructor will not be able to see your progress. This could have strong consequences in the event your grade depends on it. You can enroll it again at any time.'

type CoursesListProps = {
    tab: CoursesTab
    courses: CourseRow[]
}

type CourseAction = CourseStudentAction

function CourseBadges({ course }: { course: CourseRow }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {course.isOwner ? (
                <Badge variant="outline" className="gap-1">
                    <GraduationCapIcon aria-hidden />
                    Instructor
                </Badge>
            ) : null}
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

type StudentCourseCardProps = {
    course: CourseRow
    tab: CoursesTab
    pendingKey: string | null
    onAction: (course: CourseRow, action: CourseAction) => void
}

function StudentCourseCard({ course, tab, pendingKey, onAction }: StudentCourseCardProps) {
    const isPending = pendingKey === course.course_key

    return (
        <div
            className={cn(
                'group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card py-4 text-left shadow-sm transition-[box-shadow,border-color,background-color] duration-200 ease-out',
                'hover:border-primary/25 hover:bg-accent/40 hover:shadow-lg',
            )}
        >
            <CardHeader className="-mt-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="w-full flex flex-row items-start">
                        <Link
                            href={courseHref(course.course_key)}
                            className="line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            {course.title}
                        </Link>
                        <div className="flex-1" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-4 shrink-0 -mr-2 mt-1"
                                    disabled={isPending}
                                    aria-label={`Actions for ${course.title}`}
                                >
                                    {isPending ? (
                                        <Loader2 className="size-4 animate-spin" aria-hidden />
                                    ) : (
                                        <EllipsisVerticalIcon className="size-4" aria-hidden />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {course.isOwner ? (
                                    <DropdownMenuItem asChild>
                                        <Link href={instructorCoursePropertiesHref(course.course_key)}>
                                            <EditIcon aria-hidden />
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                ) : null}
                                {tab === 'available' ? (
                                    <DropdownMenuItem onClick={() => onAction(course, 'enroll')}>
                                        <GraduationCap aria-hidden />
                                        Enroll
                                    </DropdownMenuItem>
                                ) : null}
                                {tab === 'enrolled' ? (
                                    <>
                                        {!course.isOwner ? (
                                            <DropdownMenuItem onClick={() => onAction(course, 'unenroll')}>
                                                <LogOutIcon aria-hidden />
                                                Unenroll
                                            </DropdownMenuItem>
                                        ) : null}
                                        <DropdownMenuItem onClick={() => onAction(course, 'archive')}>
                                            <ArchiveIcon aria-hidden />
                                            Archive
                                        </DropdownMenuItem>
                                    </>
                                ) : null}
                                {tab === 'archived' ? (
                                    <>
                                        {!course.isOwner ? (
                                            <DropdownMenuItem onClick={() => onAction(course, 'unenroll')}>
                                                <LogOutIcon aria-hidden />
                                                Unenroll
                                            </DropdownMenuItem>
                                        ) : null}
                                        <DropdownMenuItem onClick={() => onAction(course, 'unarchive')}>
                                            <ArchiveRestoreIcon aria-hidden />
                                            Unarchive
                                        </DropdownMenuItem>
                                    </>
                                ) : null}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardTitle>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs group-hover:text-foreground/80">
                    <SignatureIcon className="size-3 shrink-0" aria-hidden />
                    {course.ownerName}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
                {course.description ? (
                    <MarkdownText className="line-clamp-4">{course.description}</MarkdownText>
                ) : null}
                <div className="mt-auto">
                    <CourseBadges course={course} />
                </div>
            </CardContent>
        </div>
    )
}

const emptyStateByTab: Record<CoursesTab, { title: string; description: string; icon: typeof BookOpenCheckIcon }> = {
    enrolled: {
        title: 'No enrolled courses',
        description: 'Browse available courses and enroll into them.',
        icon: BookOpenCheckIcon,
    },
    available: {
        title: 'No courses available',
        description: 'There are no avaiable courses you can join right now. Check back later.',
        icon: GraduationCap,
    },
    archived: {
        title: 'No archived courses',
        description:
            'Archived courses will appear here. You can archive enrolled courses from the Enrolled tab. Archived courses will not be visible in the Enrolled tab but you still be enrolled in them.',
        icon: ArchiveIcon,
    },
}

export function CoursesList({ tab, courses }: CoursesListProps) {
    const router = useRouter()
    const [pendingKey, setPendingKey] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [officialFilter, setOfficialFilter] = useState<CoursesOfficialFilter>('all')
    const [instructorFilter, setInstructorFilter] = useState<CoursesInstructorFilter>('all')
    const [sortField, setSortField] = useState<CoursesSortField>('title')
    const [, startTransition] = useTransition()
    const [runConfirmDialog, ConfirmDialogComponent] = useConfirmDialog({
        title: 'Are you sure?',
        acceptLabel: 'Confirm',
        cancelLabel: 'Cancel',
    })
    const [runUnenrollDialog, UnenrollDialogComponent] = useConfirmDialog({
        title: 'Unenroll from course',
        acceptLabel: 'Unenroll',
        cancelLabel: 'Cancel',
    })

    const visibleCourses = useMemo(
        () => filterAndSortCourses(courses, searchQuery, officialFilter, sortField, instructorFilter),
        [courses, instructorFilter, officialFilter, searchQuery, sortField],
    )

    async function handleAction(course: CourseRow, action: CourseAction) {
        const title = course.title
        let confirmed = false

        switch (action) {
            case 'enroll':
                confirmed = await runConfirmDialog(`Are you sure you want to enroll in “${title}”?`)
                break
            case 'archive':
                confirmed = await runConfirmDialog(`Are you sure you want to archive “${title}”?`)
                break
            case 'unarchive':
                confirmed = await runConfirmDialog(`Are you sure you want to unarchive “${title}”?`)
                break
            case 'unenroll':
                confirmed = await runUnenrollDialog(UNENROLL_CONFIRMATION)
                break
        }

        if (!confirmed) {
            return
        }

        setPendingKey(course.course_key)
        startTransition(async () => {
            const result = await runServerAction(course.course_key, action)
            setPendingKey(null)

            if (result.ok) {
                toast.success(courseActionSuccessMessage(action, course.title, course.ownerName))
                router.refresh()
                return
            }

            toast.error(result.error)
        })
    }

    if (courses.length === 0) {
        const empty = emptyStateByTab[tab]
        const EmptyIcon = empty.icon

        return (
            <Empty className="border border-dashed border-border bg-muted/20 py-12">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <EmptyIcon aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>{empty.title}</EmptyTitle>
                    <EmptyDescription>{empty.description}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <CoursesListToolbar
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    officialFilter={officialFilter}
                    onOfficialFilterChange={setOfficialFilter}
                    instructorFilter={instructorFilter}
                    onInstructorFilterChange={setInstructorFilter}
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
                            <StudentCourseCard
                                key={course.course_key}
                                course={course}
                                tab={tab}
                                pendingKey={pendingKey}
                                onAction={handleAction}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialogComponent />
            <UnenrollDialogComponent />
        </>
    )
}

async function runServerAction(courseKey: string, action: CourseAction) {
    switch (action) {
        case 'enroll':
            return enrollCourseAction(courseKey)
        case 'unenroll':
            return unenrollCourseAction(courseKey)
        case 'archive':
            return archiveCourseAction(courseKey)
        case 'unarchive':
            return unarchiveCourseAction(courseKey)
    }
}
