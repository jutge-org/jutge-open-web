import { JutgeAIAuditView } from '@/components/instructor/jutgeai/JutgeAIAuditView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorJutgeaiSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'JutgeAI Audit — Instructor — Jutge.org' }

const baseHref = '/instructor/jutgeai'

export default function InstructorJutgeAIAuditPage() {
    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'JutgeAI', url: `${baseHref}/chat` },
            ]}
        >
            <InstructorSubNav
                items={instructorJutgeaiSubNav}
                baseHref={baseHref}
                activeSegment="audit"
            />
            <JutgeAIAuditView />
        </InstructorPageShell>
    )
}
