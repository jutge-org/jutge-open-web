import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { SubmissionsList } from '@/components/submissions/SubmissionsList'
import { getCurrentClient } from '@/lib/auth'
import { renderAuthed } from '@/lib/renderAuthed'
import { fetchSubmissionsData } from '@/services/queries/submissions'

export const metadata = { title: 'Submissions — Jutge.org' }

export default async function SubmissionsPage() {
    return renderAuthed(async () => {
        const client = await getCurrentClient()
        const rows = await fetchSubmissionsData(client)

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs breadcrumbs={[{ title: 'Submissions', url: '/submissions' }]} />
                <PageTitle section="/submissions" authenticated />
                <SubmissionsList rows={rows} showHelp />
            </div>
        )
    })
}
