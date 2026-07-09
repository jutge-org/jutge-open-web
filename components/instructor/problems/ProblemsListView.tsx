import { fetchInstructorProblemTableRows } from '@/actions/instructor'
import InstructorProblemTable from './table/InstructorProblemTable'

export async function ProblemsListView() {
    const rows = await fetchInstructorProblemTableRows()
    return (
        <>
            <h1>Authored Problems</h1>
            <InstructorProblemTable rows={rows} />
        </>
    )
}
