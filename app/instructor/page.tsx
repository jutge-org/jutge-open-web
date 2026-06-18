import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { renderInstructor } from '@/lib/renderAuthed'

export const metadata = { title: 'Instructor — Jutge.org' }

export default async function InstructorPage() {
    return renderInstructor(() => (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Instructor', url: '/instructor' }]} />
            <PageTitle section="/instructor" authenticated />
            <p className="text-muted-foreground">Coming soon.</p>
        </div>
    ))
}
