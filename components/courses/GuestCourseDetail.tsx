import { Globe, ShieldCheck, SignatureIcon } from 'lucide-react'

import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CourseGuestLists } from '@/components/courses/CourseGuestLists'
import { buildGuestCourseRow } from '@/lib/courses'
import type { PublicCourse } from '@/lib/jutge_api_client'

type GuestCourseDetailProps = {
    courseKey: string
    course: PublicCourse
}

export function GuestCourseDetail({ courseKey, course }: GuestCourseDetailProps) {
    const row = buildGuestCourseRow(course, courseKey)

    return (
        <Card className="border border-border shadow-sm ring-0">
            <CardContent className="flex w-full flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                        <CourseIconImage iconUrl={row.iconUrl} size="lg" />
                        <div className="min-w-0 flex-1">
                            <h1
                                className="text-2xl font-semibold tracking-tight text-foreground"
                                data-recent-course-icon-url={row.iconUrl}
                            >
                                {row.title}
                            </h1>
                            <p className="mt-1.5 flex min-w-0 items-center gap-1 text-muted-foreground">
                                <SignatureIcon className="size-3 shrink-0" aria-hidden />
                                {row.ownerName}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                        {row.isOfficial ? (
                            <Badge variant="outline" className="gap-1">
                                <ShieldCheck aria-hidden />
                                Official
                            </Badge>
                        ) : null}
                        {row.isPublic ? (
                            <Badge variant="outline" className="gap-1">
                                <Globe aria-hidden />
                                Public
                            </Badge>
                        ) : null}
                    </div>
                </div>
                {row.description ? (
                    <div className="pt-2">
                        <h2 className="text-sm font-medium text-foreground">Description</h2>
                        <div className="mt-1.5 text-sm text-muted-foreground">
                            <MarkdownText>{row.description}</MarkdownText>
                        </div>
                    </div>
                ) : null}
                <CourseGuestLists lists={course.lists} problemCount={course.problem_count} />
            </CardContent>
        </Card>
    )
}
