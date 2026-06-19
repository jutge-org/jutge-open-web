import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
    const authenticated = await isAuthenticated()
    redirect(authenticated ? '/courses/enrolled' : '/courses/public')
}
