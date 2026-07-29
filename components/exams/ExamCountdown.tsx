'use client'

import { useEffect, useState } from 'react'

import { formatCountdown } from '@/lib/exams'
import { cn } from '@/lib/utils'

const TICK_MS = 60_000

type ExamCountdownProps = {
    /** Target moment in epoch milliseconds. */
    targetMs: number
    /** Text shown before the remaining time, e.g. "Starts in". */
    prefix?: string
    className?: string
}

// A ticking countdown to a moment. Re-renders once a minute and renders nothing once elapsed.
export function ExamCountdown({ targetMs, prefix, className }: ExamCountdownProps) {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), TICK_MS)
        return () => clearInterval(id)
    }, [])

    const remaining = formatCountdown(targetMs - now)
    if (remaining === null) {
        return null
    }

    return (
        <span className={cn('tabular-nums', className)}>
            {prefix ? `${prefix} ` : ''}
            {remaining}
        </span>
    )
}
