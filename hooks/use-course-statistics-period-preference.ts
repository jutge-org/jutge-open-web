'use client'

import { useEffect, useState } from 'react'

import {
    courseStatisticsPeriodStorageKey,
    parseCourseStatisticsPeriod,
    serializeCourseStatisticsPeriod,
    type CourseStatisticsPeriod,
} from '@/lib/instructor/courseStatisticsPeriod'

export function useCourseStatisticsPeriodPreference(courseKey: string, defaultStartDate: Date, defaultEndDate: Date) {
    const fallback: CourseStatisticsPeriod = { startDate: defaultStartDate, endDate: defaultEndDate }
    const [period, setPeriodState] = useState<CourseStatisticsPeriod>(fallback)

    useEffect(() => {
        const stored = parseCourseStatisticsPeriod(
            localStorage.getItem(courseStatisticsPeriodStorageKey(courseKey)),
            fallback,
        )
        setPeriodState(stored)
    }, [courseKey, defaultStartDate, defaultEndDate])

    function setPeriod(startDate: Date, endDate: Date) {
        const next = { startDate, endDate }
        setPeriodState(next)
        localStorage.setItem(courseStatisticsPeriodStorageKey(courseKey), serializeCourseStatisticsPeriod(next))
    }

    return [period, setPeriod] as const
}
