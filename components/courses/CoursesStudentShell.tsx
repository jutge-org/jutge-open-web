'use client'

import { useEffect, useState } from 'react'

import { CoursesList } from '@/components/courses/CoursesList'
import { CoursesNav } from '@/components/courses/CoursesNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import jutge from '@/lib/jutge'
import type { CoursesData, CoursesTab } from '@/lib/courses'
import { fetchCoursesData } from '@/lib/data/courses'

const emptyCourseCounts: Pick<CoursesData, 'enrolled' | 'available' | 'archived'> = {
    enrolled: [],
    available: [],
    archived: [],
}

type CoursesStudentShellProps = {
    activeTab: CoursesTab
    data?: CoursesData | null
    children: React.ReactNode
}

export function CoursesStudentShell({ activeTab, data, children }: CoursesStudentShellProps) {
    const counts = data ?? emptyCourseCounts

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Courses', url: '/courses' }]} />
            <PageTitle section="/courses" authenticated />
            <CoursesNav activeTab={activeTab} counts={counts} />
            {children}
        </div>
    )
}

type CoursesTabPageProps = {
    activeTab: CoursesTab
    userId: string
}

export function CoursesTabPage({ activeTab, userId }: CoursesTabPageProps) {
    const [data, setData] = useState<CoursesData | null>(null)

    useEffect(() => {
        void fetchCoursesData(jutge).then(setData)
    }, [])

    return (
        <CoursesStudentShell activeTab={activeTab} data={data}>
            <CoursesList tab={activeTab} courses={data?.[activeTab] ?? []} userId={userId} loading={data === null} />
        </CoursesStudentShell>
    )
}
