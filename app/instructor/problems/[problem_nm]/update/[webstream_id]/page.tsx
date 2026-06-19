import { ProblemUpdateTerminalView } from '@/components/instructor/problems/ProblemUpdateTerminalView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

export const metadata = { title: 'Updating problem — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ problem_nm: string; webstream_id: string }>
}

export default async function InstructorProblemUpdateTerminalPage({ params }: Props) {
    const { problem_nm } = await params
    const baseHref = `/instructor/problems/${problem_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Problems', url: '/instructor/problems' },
                { title: problem_nm, url: `${baseHref}/properties` },
                { title: 'Update', url: `${baseHref}/update` },
            ]}
        >
            <ProblemUpdateTerminalView />
        </InstructorPageShell>
    )
}
