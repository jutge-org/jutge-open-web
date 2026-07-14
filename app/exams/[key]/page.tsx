import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { ExamDetailCard } from '@/components/exams/ExamDetailCard'
import { ExamsReminderAlert } from '@/components/exams/ExamsReminderAlert'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchExamDetail } from '@/services/queries/exams'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ key: string }>
}

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
                        { title: exam.title, url: `/exams/${exam.exam_nm}` },
                    ]}
                />
                <ExamsReminderAlert />
                <ExamDetailCard exam={exam} />
            </div>
        )
    })
}
