'use client'

import { useEffect, useState, type ReactNode } from 'react'

import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import {
    SupervisionStudentProfileCard,
    SupervisionStudentProfileCardLoading,
} from '@/components/supervision/SupervisionStudentProfileCard'
import { fetchSupervisionStudentProfile } from '@/lib/data/supervision'
import type { PublicProfile } from '@/lib/jutge_api_client'
import type { SupervisionContext } from '@/lib/supervision'
import type { MainBreadcrumbSegment } from '@/store/MainBreadcrumbs'

type SupervisionPageShellProps = {
    context: SupervisionContext
    courseTitle?: string
    breadcrumbs: MainBreadcrumbSegment[]
    /** When provided, skips the shell profile fetch (e.g. student overview already loaded it). */
    profile?: PublicProfile | null
    children: ReactNode
}

export function SupervisionPageShell({
    context,
    courseTitle,
    breadcrumbs,
    profile: profileProp,
    children,
}: SupervisionPageShellProps) {
    const [fetchedProfile, setFetchedProfile] = useState<PublicProfile | null | undefined>(undefined)
    const profile = profileProp !== undefined ? profileProp : fetchedProfile
    const course = { title: courseTitle?.trim() || context.courseKey }

    useEffect(() => {
        if (profileProp !== undefined) {
            return
        }

        let cancelled = false
        setFetchedProfile(undefined)

        void fetchSupervisionStudentProfile(context.courseKey, context.email).then((next) => {
            if (!cancelled) setFetchedProfile(next)
        })

        return () => {
            cancelled = true
        }
    }, [context.courseKey, context.email, profileProp])

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            {profile ? (
                <SupervisionStudentProfileCard profile={profile} course={course} />
            ) : profile === null ? (
                <SupervisionStudentProfileCard
                    profile={{
                        email: context.email,
                        name: context.studentName?.trim() || context.email,
                        username: null,
                        nickname: null,
                    }}
                    course={course}
                />
            ) : (
                <SupervisionStudentProfileCardLoading />
            )}
            {children}
        </div>
    )
}
