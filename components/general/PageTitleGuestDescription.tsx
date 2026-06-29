'use client'

import { SignInTextLink } from '@/components/SignInTextLink'
import type { PageTitleSection } from '@/components/general/PageTitle'

const descriptionsWithSignIn: Partial<Record<PageTitleSection, { before: string; after: string }>> = {
    '/problems': { before: 'Browse public programming problems. ', after: ' to solve them and find more.' },
    '/courses': { before: 'Browse public courses. ', after: ' to enroll in a course and find more.' },
}

type PageTitleGuestDescriptionProps = {
    section: PageTitleSection
    fallback: string
}

export function PageTitleGuestDescription({ section, fallback }: PageTitleGuestDescriptionProps) {
    const parts = descriptionsWithSignIn[section]
    if (!parts) return fallback

    return (
        <>
            {parts.before}
            <SignInTextLink />
            {parts.after}
        </>
    )
}
