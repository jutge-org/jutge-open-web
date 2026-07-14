import { fetchInstructorProblemTableRows } from '@/actions/instructor'
import InstructorProblemTable from './table/InstructorProblemTable'

export async function ProblemsListView() {
    //
    // NOTE(pauek): This page is here to fetch problems on the server,
    //              so that eventually we can cache them. Do not remove it!
    //
    const rows = await fetchInstructorProblemTableRows()
    return <InstructorProblemTable rows={rows} />
}
