import { NavigationGuardProvider } from 'next-navigation-guard'
import type { ReactNode } from 'react'

import { renderInstructor } from '@/lib/renderAuthed'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'

export default async function InstructorLayout({ children }: { children: ReactNode }) {
    return renderInstructor(() => (
        <NavigationGuardProvider>
            <InstructorPageShell breadcrumbs={[{ title: 'Instructor', url: '/instructor' }]}>
                {children}
            </InstructorPageShell>
        </NavigationGuardProvider>
    ))
}
