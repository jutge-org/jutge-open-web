import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { UserProfile } from '@/components/UserProfile'
import { renderAuthed } from '@/lib/renderAuthed'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Profile — Jutge.org' }

export default async function ProfilePage() {
    return renderAuthed((user) => (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Profile', url: '/profile' }]} />
            <PageTitle section="/profile" authenticated />
            <UserProfile user={user} />
        </div>
    ))
}
