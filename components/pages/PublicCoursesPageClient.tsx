'use client'

import { useEffect, useState } from 'react'

import { GuestCoursesList } from '@/components/courses/GuestCoursesList'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import type { GuestCourseRow } from '@/lib/courses'
import { fetchPublicCourses } from '@/services/queries/courses'

export function PublicCoursesPageClient() {
    const { authenticated, client, loading: authLoading } = useJutgeAuth()
    const [courses, setCourses] = useState<GuestCourseRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        setLoading(true)
        void fetchPublicCourses(client).then((data) => {
            if (!cancelled) {
                setCourses(data)
                setLoading(false)
            }
        })

        return () => {
            cancelled = true
        }
    }, [authLoading, client])

    if (authLoading || loading) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={[{ title: 'Courses', url: '/courses/public' }]} />
            <PageTitle
                section="/courses"
                authenticated={authenticated}
                hidden={false}
                description={authenticated ? 'Browse public courses available on Jutge.org' : undefined}
            />
            <GuestCoursesList courses={courses} />
        </div>
    )
}
