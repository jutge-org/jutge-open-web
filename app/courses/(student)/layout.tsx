import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function CoursesStudentLayout({ children }: { children: React.ReactNode }) {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
        redirect('/courses/public')
    }

    return children
}
