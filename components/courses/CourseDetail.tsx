import { ArchiveIcon, BookOpenCheckIcon, Globe, ShieldCheck, SignatureIcon } from 'lucide-react'

import { CourseDetailActions } from '@/components/courses/CourseDetailActions'
import { CourseLists } from '@/components/courses/CourseLists'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { buildCourseRow, type CourseStatus } from '@/lib/courses'
import type { LastSubmissionInfo } from '@/lib/submissions'
import type { AbstractStatus, Course, Language } from '@/lib/jutge_api_client'
import type { CourseListData } from '@/services/queries/lists'

type CourseDetailProps = {
    courseKey: string
    course: Course
    status: CourseStatus
    lists: CourseListData[]
    languages: Record<string, Language>
    statuses?: Record<string, AbstractStatus>
    lastSubmissions?: Record<string, LastSubmissionInfo>
}

export function CourseDetail({
    courseKey,
    course,
    status,
    lists,
    languages,
    statuses,
    lastSubmissions,
}: CourseDetailProps) {
    const row = buildCourseRow(course, status)

    return (
        <div className="flex flex-col gap-6">
            <Card className="border border-border shadow-sm ring-0">
                <CardContent className="flex w-full flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{row.title}</h1>
                        <CourseDetailActions
                            courseKey={courseKey}
                            title={row.title}
                            ownerName={row.ownerName}
                            status={status}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1 text-muted-foreground">
                            <SignatureIcon className="size-3 shrink-0" aria-hidden />
                            {row.ownerName}
                        </p>
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
                            {status === 'enrolled' ? (
                                <Badge variant="outline" className="gap-1">
                                    <BookOpenCheckIcon aria-hidden />
                                    Enrolled
                                </Badge>
                            ) : null}
                            {status === 'archived' ? (
                                <Badge variant="outline" className="gap-1">
                                    <ArchiveIcon aria-hidden />
                                    Archived
                                </Badge>
                            ) : null}
                        </div>
                    </div>
                    {row.description ? (
                        <div className="pt-2">
                            <MarkdownText>{row.description}</MarkdownText>
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            {status !== 'available' ? (
                <CourseLists
                    courseKey={courseKey}
                    lists={lists}
                    languages={languages}
                    statuses={statuses}
                    lastSubmissions={lastSubmissions}
                />
            ) : null}
        </div>
    )
}
