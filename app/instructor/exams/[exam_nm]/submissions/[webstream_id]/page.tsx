import { ExamSubmissionsWebStreamView } from '@/components/instructor/exams/ExamSubmissionsWebStreamView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorExamSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Exam submissions download — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ exam_nm: string; webstream_id: string }>
}

export default async function InstructorExamSubmissionsWebStreamPage({ params }: Props) {
    const { exam_nm, webstream_id } = await params
    const baseHref = `/instructor/exams/${exam_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Exams', url: '/instructor/exams' },
                { title: exam_nm, url: `${baseHref}/submissions` },
            ]}
        >
            <InstructorSubNav items={instructorExamSubNav(exam_nm)} baseHref={baseHref} activeSegment="submissions" />
            <ExamSubmissionsWebStreamView webstream_id={webstream_id} />
        </InstructorPageShell>
    )
}
