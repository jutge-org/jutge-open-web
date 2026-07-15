'use client'

import { useEffect, useMemo, useState } from 'react'

import { parseStoredSupervisionCourseKey, type SupervisionCourseOption } from '@/lib/supervision'
import { useOpenWebSettingsStore } from '@/store/openWebSettings'

export function useSupervisionCoursePreference(_userId: string, courses: SupervisionCourseOption[]) {
    const courseKeys = useMemo(() => courses.map((course) => course.courseKey), [courses])
    const ready = useOpenWebSettingsStore((state) => state.ready)
    const storedCourseKey = useOpenWebSettingsStore((state) => state.settings.ui.supervisionLastCourse)
    const setSupervisionLastCourse = useOpenWebSettingsStore((state) => state.setSupervisionLastCourse)

    const [courseKey, setCourseKeyState] = useState('')

    useEffect(() => {
        if (!ready) {
            return
        }

        const stored = parseStoredSupervisionCourseKey(storedCourseKey || null, courseKeys)
        setCourseKeyState(stored ?? '')
    }, [courseKeys, ready, storedCourseKey])

    function setCourseKey(next: string) {
        setCourseKeyState(next)
        setSupervisionLastCourse(next)
    }

    return [courseKey, setCourseKey] as const
}
