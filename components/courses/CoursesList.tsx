'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { BookOpen, BookPlus, CheckCircle2, Globe, GraduationCap, Loader2, LogOut, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

import { enrollCourseAction, unenrollCourseAction } from '@/actions/courses'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CourseRow, CoursesData } from '@/lib/courses'
import { cn } from '@/lib/utils'

type CoursesListProps = {
    data: CoursesData
}

type CourseCardProps = {
    course: CourseRow
    pendingKey: string | null
    onEnroll: (courseKey: string) => void
    onUnenroll: (courseKey: string) => void
}

function CourseBadges({ course }: { course: CourseRow }) {
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

function CourseCard({ course, pendingKey, onEnroll, onUnenroll }: CourseCardProps) {
    const isPending = pendingKey === course.course_key
    const enrolled = course.status === 'enrolled'

    return (
        <Card
            className={cn(
                'h-full transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md',
                enrolled ? 'border-t-4 border-t-teal-500' : 'border-t-4 border-t-muted-foreground/30',
            )}
        >
            <CardHeader>
                <CardTitle className="line-clamp-2 text-base leading-snug">{course.title}</CardTitle>
                <CardDescription className="font-mono text-xs">{course.course_key}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
                {course.description ? (
                    <MarkdownText className="line-clamp-3">{course.description}</MarkdownText>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No description provided.</p>
                )}
                {course.annotation ? (
                    <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                        {course.annotation}
                    </p>
                ) : null}
                <CourseBadges course={course} />
            </CardContent>
            <CardFooter>
                {enrolled ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={isPending}
                        onClick={() => onUnenroll(course.course_key)}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" aria-hidden />
                        ) : (
                            <LogOut aria-hidden />
                        )}
                        {isPending ? 'Leaving…' : 'Leave course'}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        size="sm"
                        className="w-full"
                        disabled={isPending}
                        onClick={() => onEnroll(course.course_key)}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" aria-hidden />
                        ) : (
                            <BookPlus aria-hidden />
                        )}
                        {isPending ? 'Enrolling…' : 'Enroll'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

function CoursesGrid({
    courses,
    emptyTitle,
    emptyDescription,
    emptyIcon: EmptyIcon,
    pendingKey,
    onEnroll,
    onUnenroll,
}: {
    courses: CourseRow[]
    emptyTitle: string
    emptyDescription: string
    emptyIcon: typeof BookOpen
    pendingKey: string | null
    onEnroll: (courseKey: string) => void
    onUnenroll: (courseKey: string) => void
}) {
    if (courses.length === 0) {
        return (
            <Empty className="border border-dashed border-border bg-muted/20 py-12">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <EmptyIcon aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>{emptyTitle}</EmptyTitle>
                    <EmptyDescription>{emptyDescription}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
                <CourseCard
                    key={course.course_key}
                    course={course}
                    pendingKey={pendingKey}
                    onEnroll={onEnroll}
                    onUnenroll={onUnenroll}
                />
            ))}
        </div>
    )
}

export function CoursesList({ data }: CoursesListProps) {
    const router = useRouter()
    const [pendingKey, setPendingKey] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const defaultTab = data.enrolled.length > 0 ? 'enrolled' : 'available'

    function runCourseAction(courseKey: string, action: 'enroll' | 'unenroll') {
        setPendingKey(courseKey)
        startTransition(async () => {
            const result =
                action === 'enroll'
                    ? await enrollCourseAction(courseKey)
                    : await unenrollCourseAction(courseKey)

            setPendingKey(null)

            if (result.ok) {
                toast.success(action === 'enroll' ? 'Enrolled successfully' : 'Left the course')
                router.refresh()
                return
            }

            toast.error(result.error)
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <section aria-label="Course summary" className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-border border-t-4 border-t-teal-500 bg-card px-5 py-5 shadow-sm">
                    <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Enrolled</span>
                        <span className="text-3xl font-semibold tracking-tight tabular-nums text-teal-600 dark:text-teal-400">
                            {data.enrolled.length.toLocaleString()}
                        </span>
                    </div>
                    <CheckCircle2 className="size-8 shrink-0 text-teal-600/80 dark:text-teal-400/80" aria-hidden />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-border border-t-4 border-t-muted-foreground/40 bg-card px-5 py-5 shadow-sm">
                    <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Available</span>
                        <span className="text-3xl font-semibold tracking-tight tabular-nums">
                            {data.available.length.toLocaleString()}
                        </span>
                    </div>
                    <GraduationCap className="size-8 shrink-0 text-muted-foreground/70" aria-hidden />
                </div>
            </section>

            <Tabs defaultValue={defaultTab} className="gap-4">
                <TabsList>
                    <TabsTrigger value="enrolled" disabled={isPending && pendingKey !== null}>
                        My courses
                        {data.enrolled.length > 0 ? (
                            <Badge variant="secondary" className="ml-1.5 px-1.5">
                                {data.enrolled.length}
                            </Badge>
                        ) : null}
                    </TabsTrigger>
                    <TabsTrigger value="available" disabled={isPending && pendingKey !== null}>
                        Available
                        {data.available.length > 0 ? (
                            <Badge variant="outline" className="ml-1.5 px-1.5">
                                {data.available.length}
                            </Badge>
                        ) : null}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="enrolled">
                    <CoursesGrid
                        courses={data.enrolled}
                        emptyTitle="No enrolled courses"
                        emptyDescription="Browse available courses and enroll to see them here."
                        emptyIcon={BookOpen}
                        pendingKey={pendingKey}
                        onEnroll={(key) => runCourseAction(key, 'enroll')}
                        onUnenroll={(key) => runCourseAction(key, 'unenroll')}
                    />
                </TabsContent>

                <TabsContent value="available">
                    <CoursesGrid
                        courses={data.available}
                        emptyTitle="No courses available"
                        emptyDescription="There are no open courses you can join right now. Check back later."
                        emptyIcon={GraduationCap}
                        pendingKey={pendingKey}
                        onEnroll={(key) => runCourseAction(key, 'enroll')}
                        onUnenroll={(key) => runCourseAction(key, 'unenroll')}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
