import type { Metadata } from 'next'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { SupervisionForm } from '@/components/supervision/SupervisionForm'
import { renderSupervisor } from '@/lib/renderAuthed'
import { fetchSupervisionCourseOptions } from '@/services/queries/supervision'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Supervision — Jutge.org' }

export default async function SupervisionPage() {
    return renderSupervisor(async (user) => {
        const courses = await fetchSupervisionCourseOptions()

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Supervision', url: '/supervision' }]} />
                <PageTitle section="/supervision" authenticated hidden={false} />
                <SupervisionForm userId={user.id} courses={courses} />
            </div>
        )
    })
}
