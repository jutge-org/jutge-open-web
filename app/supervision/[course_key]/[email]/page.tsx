'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

import { SupervisorGate } from '@/components/ClientGates'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { SupervisionStudentView, SupervisionStudentViewLoading } from '@/components/supervision/SupervisionStudentView'
import { normalizeCourseKeyParam } from '@/lib/courses'
import { fetchSupervisionStudentPageData, type SupervisionStudentPageData } from '@/lib/data/supervision'

export default function SupervisionStudentPage() {
    return (
        <SupervisorGate>
            <SupervisionStudentPageContent />
        </SupervisorGate>
    )
}

function SupervisionStudentPageContent() {
    const params = useParams<{ course_key: string; email: string }>()
    const courseKey = normalizeCourseKeyParam(params.course_key)
    const email = decodeURIComponent(params.email)
    const [data, setData] = useState<SupervisionStudentPageData | null | undefined>(undefined)

    useEffect(() => {
        void fetchSupervisionStudentPageData(courseKey, email).then(setData)
    }, [courseKey, email])

    if (data === null) {
        notFound()
    }

    const studentName = data?.profile.name?.trim() || email

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Supervision', url: '/supervision' },
                    { title: data?.courseTitle ?? courseKey, url: '/supervision' },
                    { title: studentName, url: `/supervision/${courseKey}/${email}` },
                ]}
            />
            <PageTitle section="/supervision" authenticated hidden={false} />
            {data === undefined ? <SupervisionStudentViewLoading /> : <SupervisionStudentView data={data} />}
        </div>
    )
}
