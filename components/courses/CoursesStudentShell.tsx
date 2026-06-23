'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AuthedGate } from '@/components/auth/AuthGates'
import { CoursesList } from '@/components/courses/CoursesList'
import { CoursesNav } from '@/components/courses/CoursesNav'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import type { CoursesData, CoursesTab } from '@/lib/courses'
import { fetchCoursesData } from '@/services/queries/courses'

type CoursesStudentShellProps = {
    activeTab: CoursesTab
    data: CoursesData
    children: React.ReactNode
}

export function CoursesStudentShell({ activeTab, data, children }: CoursesStudentShellProps) {
    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Courses', url: '/courses' }]} />
            <PageTitle section="/courses" authenticated />
            <CoursesNav
                activeTab={activeTab}
                counts={{
                    enrolled: data.enrolled,
                    available: data.available,
                    archived: data.archived,
                }}
            />
            {children}
        </div>
    )
}

type CoursesTabPageProps = {
    activeTab: CoursesTab
}

export function CoursesTabPage({ activeTab }: CoursesTabPageProps) {
    const router = useRouter()
    const { authenticated, client, loading: authLoading } = useJutgeAuth()
    const [data, setData] = useState<CoursesData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return
        if (!authenticated) {
            router.replace('/courses/public')
            return
        }

        let cancelled = false
        setLoading(true)
        void fetchCoursesData(client).then((result) => {
            if (!cancelled) {
                setData(result)
                setLoading(false)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, authenticated, client, router])

    if (authLoading || !authenticated || loading || !data) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <AuthedGate>
            <CoursesStudentShell activeTab={activeTab} data={data}>
                <CoursesList tab={activeTab} courses={data[activeTab]} />
            </CoursesStudentShell>
        </AuthedGate>
    )
}
