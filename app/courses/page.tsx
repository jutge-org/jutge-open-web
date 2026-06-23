import type { Metadata } from 'next'

import { CoursesTabPage } from '@/components/courses/CoursesStudentShell'
import { coursesPageTitles, parseCoursesTab } from '@/lib/courses'

type PageProps = {
    searchParams: Promise<{ tab?: string | string[] }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const { tab } = await searchParams
    const activeTab = parseCoursesTab(tab)

    return { title: `${coursesPageTitles[activeTab]} — Jutge.org` }
}

export default async function CoursesPage({ searchParams }: PageProps) {
    const { tab } = await searchParams
    const activeTab = parseCoursesTab(tab)

    return <CoursesTabPage activeTab={activeTab} />
}
