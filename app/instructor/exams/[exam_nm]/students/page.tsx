import { ExamStudentsView } from '@/components/instructor/exams/ExamStudentsView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorExamSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Exam students — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ exam_nm: string }>
}

export default async function InstructorExamStudentsPage({ params }: Props) {
    const { exam_nm } = await params
    const baseHref = `/instructor/exams/${exam_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Exams', url: '/instructor/exams' },
                { title: exam_nm, url: `${baseHref}/students` },
            ]}
        >
            <InstructorSubNav items={instructorExamSubNav(exam_nm)} baseHref={baseHref} activeSegment="students" />
            <ExamStudentsView />
        </InstructorPageShell>
    )
}
