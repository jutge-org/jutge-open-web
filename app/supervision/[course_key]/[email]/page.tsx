import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { SupervisionStudentView } from '@/components/supervision/SupervisionStudentView'
import { normalizeCourseKeyParam } from '@/lib/courses'
import { renderSupervisor } from '@/lib/renderAuthed'
import { fetchSupervisionStudentPageData } from '@/services/queries/supervision'

export const dynamic = 'force-dynamic'

type PageProps = {
    params: Promise<{ course_key: string; email: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { course_key: rawCourseKey, email: rawEmail } = await params
    const courseKey = normalizeCourseKeyParam(rawCourseKey)
    const email = decodeURIComponent(rawEmail)

    const data = await fetchSupervisionStudentPageData(courseKey, email)
    if (!data) {
        return { title: 'Supervision — Jutge.org' }
    }

    const studentName = data.profile.name?.trim() || email
    return { title: `${studentName} — ${data.courseTitle} — Supervision — Jutge.org` }
}

export default async function SupervisionStudentPage({ params }: PageProps) {
    const { course_key: rawCourseKey, email: rawEmail } = await params
    const courseKey = normalizeCourseKeyParam(rawCourseKey)
    const email = decodeURIComponent(rawEmail)

    return renderSupervisor(async () => {
        const data = await fetchSupervisionStudentPageData(courseKey, email)
        if (!data) {
            notFound()
        }

        const studentName = data.profile.name?.trim() || email

        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Supervision', url: '/supervision' },
                        { title: data.courseTitle, url: '/supervision' },
                        { title: studentName, url: `/supervision/${courseKey}/${email}` },
                    ]}
                />
                <PageTitle section="/supervision" authenticated hidden={false} />
                <SupervisionStudentView data={data} />
            </div>
        )
    })
}
