'use client'

import { useEffect, useState } from 'react'

import {
    courseStatisticsPeriodFromSettings,
    useOpenWebSettingsStore,
} from '@/store/openWebSettings'
import type { CourseStatisticsPeriod } from '@/lib/instructor/courseStatisticsPeriod'

export function useCourseStatisticsPeriodPreference(courseKey: string, defaultStartDate: Date, defaultEndDate: Date) {
    const ready = useOpenWebSettingsStore((state) => state.ready)
    const storedPeriod = useOpenWebSettingsStore((state) => state.settings.ui.courseStatisticsPeriod[courseKey])
    const setCourseStatisticsPeriod = useOpenWebSettingsStore((state) => state.setCourseStatisticsPeriod)

    const [period, setPeriodState] = useState<CourseStatisticsPeriod>(() => ({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
    }))

    useEffect(() => {
        if (!ready) {
            return
        }

        setPeriodState(
            courseStatisticsPeriodFromSettings(storedPeriod, {
                startDate: defaultStartDate,
                endDate: defaultEndDate,
            }),
        )
    }, [courseKey, defaultEndDate, defaultStartDate, ready, storedPeriod])

    function setPeriod(startDate: Date, endDate: Date) {
        const next = { startDate, endDate }
        setPeriodState(next)
        setCourseStatisticsPeriod(courseKey, next)
    }

    return [period, setPeriod] as const
}
