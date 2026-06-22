import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { ProfileNav } from '@/components/profile/ProfileNav'
import type { ProfileTab } from '@/lib/profile'
import type { ReactNode } from 'react'

type ProfilePageShellProps = {
    activeTab: ProfileTab
    subpage?: { title: string; url: string } | null
    children: ReactNode
}

export function ProfilePageShell({ activeTab, subpage, children }: ProfilePageShellProps) {
    const breadcrumbs = subpage
        ? [
              { title: 'Profile', url: '/profile' },
              { title: subpage.title, url: subpage.url },
          ]
        : [{ title: 'Profile', url: '/profile' }]

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            <PageTitle section="/profile" authenticated />
            <ProfileNav activeTab={activeTab} />
            {children}
        </div>
    )
}
