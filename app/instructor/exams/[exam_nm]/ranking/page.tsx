import { ExamRankingView } from '@/components/instructor/exams/ExamRankingView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorExamSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Exam ranking — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ exam_nm: string }>
}

export default async function InstructorExamRankingPage({ params }: Props) {
    const { exam_nm } = await params
    const baseHref = `/instructor/exams/${exam_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Exams', url: '/instructor/exams' },
                { title: exam_nm, url: `${baseHref}/ranking` },
            ]}
        >
            <InstructorSubNav
                items={instructorExamSubNav(exam_nm)}
                baseHref={baseHref}
                activeSegment="ranking"
            />
            <ExamRankingView />
        </InstructorPageShell>
    )
}
