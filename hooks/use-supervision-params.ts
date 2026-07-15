'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'

import { normalizeCourseKeyParam } from '@/lib/courses'
import type { SupervisionContext } from '@/lib/supervision'

export function useSupervisionParams(): SupervisionContext {
    const params = useParams<{ course_key: string; email: string }>()
    const courseKey = normalizeCourseKeyParam(params.course_key)
    const email = decodeURIComponent(params.email)

    return useMemo(
        () => ({
            courseKey,
            email,
        }),
        [courseKey, email],
    )
}
