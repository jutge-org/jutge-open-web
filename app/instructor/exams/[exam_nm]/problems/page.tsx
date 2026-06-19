import { ExamProblemsView } from '@/components/instructor/exams/ExamProblemsView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { getCurrentClient } from '@/lib/auth'
import { instructorExamSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Exam problems — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ exam_nm: string }>
}

export default async function InstructorExamProblemsPage({ params }: Props) {
    const { exam_nm } = await params
    const baseHref = `/instructor/exams/${exam_nm}`
    const client = await getCurrentClient()
    const profile = await client.student.profile.get()

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Exams', url: '/instructor/exams' },
                { title: exam_nm, url: `${baseHref}/problems` },
            ]}
        >
            <InstructorSubNav
                items={instructorExamSubNav(exam_nm)}
                baseHref={baseHref}
                activeSegment="problems"
            />
            <ExamProblemsView profile={profile} />
        </InstructorPageShell>
    )
}
