import type { Metadata } from 'next'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { renderSupervisor } from '@/lib/renderAuthed'
import { normalizeCourseKeyParam } from '@/lib/courses'

export const dynamic = 'force-dynamic'

type PageProps = {
    params: Promise<{ course_key: string; email: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { email } = await params
    const decodedEmail = decodeURIComponent(email)

    return { title: `${decodedEmail} — Supervision — Jutge.org` }
}

export default async function SupervisionStudentPage({ params }: PageProps) {
    const { course_key: rawCourseKey, email: rawEmail } = await params
    const courseKey = normalizeCourseKeyParam(rawCourseKey)
    const email = decodeURIComponent(rawEmail)

    return renderSupervisor(async () => (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs
                breadcrumbs={[
                    { title: 'Supervision', url: '/supervision' },
                    { title: courseKey, url: `/supervision/${courseKey}/${email}` },
                ]}
            />
            <PageTitle section="/supervision" authenticated hidden={false} />
            <p className="text-sm text-muted-foreground">Supervision for {email} is not available yet.</p>
        </div>
    ))
}
