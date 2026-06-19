import { ArchiveIcon, Globe, GraduationCap, ShieldCheck, SignatureIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { CourseDetailActions } from '@/components/courses/CourseDetailActions'
import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildCourseRow, type CourseStatus } from '@/lib/courses'
import type { Course } from '@/lib/jutge_api_client'

type CourseDetailProps = {
    courseKey: string
    course: Course
    status: CourseStatus
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:items-start sm:gap-3">
            <dt className="text-sm font-medium text-foreground sm:text-right">{label}</dt>
            <dd className="text-sm text-muted-foreground">{children}</dd>
        </div>
    )
}

export function CourseDetail({ courseKey, course, status }: CourseDetailProps) {
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
                    <p className="flex items-center gap-1 text-muted-foreground">
                        <SignatureIcon className="size-3 shrink-0" aria-hidden />
                        {row.ownerName}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
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
                                <GraduationCap aria-hidden />
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
                </CardContent>
            </Card>

            <Card className="border border-border shadow-sm ring-0">
                <CardHeader className="border-b pb-2">
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    {row.description ? (
                        <MarkdownText>{row.description}</MarkdownText>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No description provided.</p>
                    )}
                </CardContent>
            </Card>

            <Card size="sm" className="border border-border shadow-sm ring-0">
                <CardHeader className="border-b pb-2">
                    <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <dl className="flex flex-col gap-1.5">
                        <InfoRow label="Owner">{row.ownerName}</InfoRow>
                        <InfoRow label="Course key">{courseKey}</InfoRow>
                        <InfoRow label="Annotation">
                            {row.annotation ? row.annotation : '—'}
                        </InfoRow>
                        <InfoRow label="Problem lists">
                            {course.lists.length > 0 ? (
                                <ul className="space-y-1">
                                    {course.lists.map((listKey) => (
                                        <li key={listKey}>{listKey}</li>
                                    ))}
                                </ul>
                            ) : (
                                '—'
                            )}
                        </InfoRow>
                    </dl>
                </CardContent>
            </Card>
        </div>
    )
}
