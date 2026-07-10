import { NavigationGuardProvider } from 'next-navigation-guard'
import type { ReactNode } from 'react'

import { renderInstructor } from '@/lib/renderAuthed'

export default function InstructorLayout({ children }: { children: ReactNode }) {
    return renderInstructor(() => <NavigationGuardProvider>{children}</NavigationGuardProvider>)
}
