import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CoursesTabPage } from '@/components/courses/CoursesStudentShell'
import { isAuthenticated } from '@/lib/auth'
import { coursesPageTitles, parseCoursesTab } from '@/lib/courses'

export const dynamic = 'force-dynamic'

type PageProps = {
    searchParams: Promise<{ tab?: string | string[] }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const { tab } = await searchParams
    const activeTab = parseCoursesTab(tab)

    return { title: `${coursesPageTitles[activeTab]} — Jutge.org` }
}

export default async function CoursesPage({ searchParams }: PageProps) {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
        redirect('/courses/public')
    }

    const { tab } = await searchParams
    const activeTab = parseCoursesTab(tab)

    return <CoursesTabPage activeTab={activeTab} />
}
