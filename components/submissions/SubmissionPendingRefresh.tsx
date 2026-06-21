'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { PENDING_SUBMISSION_REFRESH_INTERVAL_MS, PENDING_SUBMISSION_REFRESH_MAX_COUNT } from '@/lib/submissions'

type SubmissionPendingRefreshProps = {
    isPending: boolean
}

export function SubmissionPendingRefresh({ isPending }: SubmissionPendingRefreshProps) {
    const router = useRouter()
    const refreshCountRef = useRef(0)

    useEffect(() => {
        if (!isPending) {
            refreshCountRef.current = 0
            return
        }

        const intervalId = window.setInterval(() => {
            refreshCountRef.current += 1
            router.refresh()

            if (refreshCountRef.current >= PENDING_SUBMISSION_REFRESH_MAX_COUNT) {
                window.clearInterval(intervalId)
            }
        }, PENDING_SUBMISSION_REFRESH_INTERVAL_MS)

        return () => window.clearInterval(intervalId)
    }, [isPending, router])

    return null
}
