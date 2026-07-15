'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

import { useAuth } from '@/components/AuthProvider'
import { PageSpinner } from '@/components/ClientGates'
import { GuestCourseDetail } from '@/components/courses/GuestCourseDetail'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { buildGuestCourseRow, publicCourseHref } from '@/lib/courses'
import { fetchPublicCourse } from '@/lib/data/courses'
import type { PublicCourse } from '@/lib/jutge_api_client'

type PublicCoursePageData = {
    courseKey: string
    course: PublicCourse
    row: ReturnType<typeof buildGuestCourseRow>
    href: string
}

export default function PublicCoursePage() {
    const { user, loading: authLoading } = useAuth()
    const params = useParams<{ course_key: string }>()
    const [data, setData] = useState<PublicCoursePageData | null | undefined>(undefined)

    useEffect(() => {
        void (async () => {
            const result = await fetchPublicCourse(params.course_key)
            if (!result) {
                setData(null)
                return
            }

            const { courseKey, course } = result
            const row = buildGuestCourseRow(course, courseKey)
            const href = publicCourseHref(courseKey)
            setData({ courseKey, course, row, href })
        })()
    }, [params.course_key])

    if (authLoading || data === undefined) {
        return <PageSpinner />
    }

    if (!data) {
        notFound()
    }

    const { courseKey, course, row, href } = data
    const authenticated = user !== null

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Courses', url: authenticated ? '/courses' : '/courses/public' },
                    { title: 'Public courses', url: '/courses/public' },
                    { title: row.title, url: href },
                ]}
            />
            <PageTitle section="/courses" authenticated={false} hidden={false} />
            <GuestCourseDetail courseKey={courseKey} course={course} />
        </div>
    )
}
