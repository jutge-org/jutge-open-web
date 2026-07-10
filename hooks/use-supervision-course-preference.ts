'use client'

import { useEffect, useMemo, useState } from 'react'

import {
    parseStoredSupervisionCourseKey,
    supervisionCourseStorageKey,
    type SupervisionCourseOption,
} from '@/lib/supervision'

export function useSupervisionCoursePreference(userId: string, courses: SupervisionCourseOption[]) {
    const courseKeys = useMemo(() => courses.map((course) => course.courseKey), [courses])
    const [courseKey, setCourseKeyState] = useState('')

    useEffect(() => {
        const stored = parseStoredSupervisionCourseKey(
            localStorage.getItem(supervisionCourseStorageKey(userId)),
            courseKeys,
        )
        setCourseKeyState(stored ?? '')
    }, [userId, courseKeys])

    function setCourseKey(next: string) {
        setCourseKeyState(next)
        const storageKey = supervisionCourseStorageKey(userId)
        if (next) {
            localStorage.setItem(storageKey, next)
            return
        }
        localStorage.removeItem(storageKey)
    }

    return [courseKey, setCourseKey] as const
}
