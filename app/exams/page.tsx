import { ExamsList } from '@/components/exams/ExamsList'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchExamsData } from '@/services/queries/exams'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Exams — Jutge.org' }

export default async function ExamsPage() {
    return renderAuthed(async () => {
        const client = await getCurrentClient()
        const rows = await fetchExamsData(client)

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Exams', url: '/exams' }]} />
                <PageTitle section="/exams" authenticated />
                <ExamsList rows={rows} />
            </div>
        )
    })
}
