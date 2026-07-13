'use client'

import { useEffect, useState } from 'react'

import { getCurrentClient } from '@/lib/data/auth'
import { fetchCourse } from '@/lib/data/courses'
import { fetchSupervisionStudentProfile } from '@/lib/data/supervision'
import { buildCourseRow } from '@/lib/courses'
import type { SupervisionContext } from '@/lib/supervision'

export type SupervisionPageMeta = {
    studentName?: string
    courseTitle?: string
}

export function useSupervisionPageMeta(context: SupervisionContext): SupervisionPageMeta | undefined {
    const [meta, setMeta] = useState<SupervisionPageMeta | undefined>(undefined)

    useEffect(() => {
        let cancelled = false
        setMeta(undefined)

        void (async () => {
            const client = await getCurrentClient()
            const [profile, courseResult] = await Promise.all([
                fetchSupervisionStudentProfile(context.courseKey, context.email),
                fetchCourse(client, context.courseKey),
            ])

            if (cancelled) return

            setMeta({
                studentName: profile?.name ?? undefined,
                courseTitle: courseResult
                    ? buildCourseRow(courseResult.course, courseResult.status, courseResult.courseKey).title
                    : undefined,
            })
        })()

        return () => {
            cancelled = true
        }
    }, [context.courseKey, context.email])

    return meta
}

export function supervisionContextWithMeta(
    context: SupervisionContext,
    meta: SupervisionPageMeta | undefined,
): SupervisionContext {
    return {
        ...context,
        studentName: meta?.studentName ?? context.studentName,
    }
}
