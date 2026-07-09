import { PageTitle } from '@/components/general/PageTitle'
import { InstructorIndex } from '@/components/instructor/InstructorIndex'

export const metadata = { title: 'Instructor — Jutge.org' }

export default function InstructorPage() {
    return (
        <>
            <PageTitle section="/instructor" authenticated />
            <InstructorIndex />
        </>
    )
}
