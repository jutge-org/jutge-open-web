import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { CourseListItemsTable } from '@/components/courses/CourseListItemsTable'
import { ExamDetailInfoCard } from '@/components/exams/ExamDetailInfoCard'
import { ExamDetailTitleCard } from '@/components/exams/ExamDetailTitleCard'
import { ExamSubmissionsTable } from '@/components/exams/ExamSubmissionsTable'
import { ExamsReminderAlert } from '@/components/exams/ExamsReminderAlert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchExamDetail } from '@/services/queries/exams'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { key } = await params
    const client = await getCurrentClient()
    const exam = await fetchExamDetail(client, key)

    if (!exam) {
        return { title: 'Exam — Jutge.org' }
    }

    return { title: `${exam.title} — Exams — Jutge.org` }
}

export default async function ExamDetailPage({ params }: PageProps) {
    return renderAuthed(async () => {
        const { key } = await params
        const client = await getCurrentClient()
        const exam = await fetchExamDetail(client, key)

        if (!exam) {
            notFound()
        }

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Exams', url: '/exams' },
                        { title: exam.title, url: `/exams/${exam.exam_key}` },
                    ]}
                />
                <ExamsReminderAlert />
                <TooltipProvider>
                    <ExamDetailTitleCard exam={exam} />
                    <ExamDetailInfoCard exam={exam} />
                    {exam.problems.length > 0 ? (
                        <Card className="gap-0 pt-2 pb-0 ring-0 border border-border shadow-sm">
                            <CardHeader className="border-b border-border px-4 py-2">
                                <CardTitle className="text-lg font-semibold">Problems</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <CourseListItemsTable
                                    items={exam.problems}
                                    languages={exam.languages}
                                    statuses={exam.problemStatuses}
                                    lastSubmissions={exam.problemLastSubmissions}
                                />
                            </CardContent>
                        </Card>
                    ) : null}
                    {exam.submissions.length > 0 ? (
                        <Card className="gap-0 pt-2 pb-0 ring-0 border border-border shadow-sm">
                            <CardHeader className="border-b border-border px-4 py-2">
                                <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ExamSubmissionsTable submissions={exam.submissions} />
                            </CardContent>
                        </Card>
                    ) : null}
                </TooltipProvider>
            </div>
        )
    })
}
