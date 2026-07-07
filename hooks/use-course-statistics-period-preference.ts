'use client'

import { useEffect, useState } from 'react'

import {
    courseStatisticsPeriodStorageKey,
    parseCourseStatisticsPeriod,
    serializeCourseStatisticsPeriod,
    type CourseStatisticsPeriod,
} from '@/lib/instructor/courseStatisticsPeriod'

export function useCourseStatisticsPeriodPreference(courseKey: string, defaultStartDate: Date, defaultEndDate: Date) {
    const [period, setPeriodState] = useState<CourseStatisticsPeriod>(() => ({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
    }))

    useEffect(() => {
        const stored = parseCourseStatisticsPeriod(localStorage.getItem(courseStatisticsPeriodStorageKey(courseKey)), {
            startDate: defaultStartDate,
            endDate: defaultEndDate,
        })
        setPeriodState(stored)
    }, [courseKey, defaultStartDate, defaultEndDate])

    function setPeriod(startDate: Date, endDate: Date) {
        const next = { startDate, endDate }
        setPeriodState(next)
        localStorage.setItem(courseStatisticsPeriodStorageKey(courseKey), serializeCourseStatisticsPeriod(next))
    }

    return [period, setPeriod] as const
}
