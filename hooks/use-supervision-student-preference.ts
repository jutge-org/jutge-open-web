'use client'

import { useEffect, useMemo, useState } from 'react'

import {
    parseStoredSupervisionStudentEmail,
    supervisionStudentStorageKey,
    type SupervisionStudentOption,
} from '@/lib/supervision'

export function useSupervisionStudentPreference(
    userId: string,
    courseKey: string,
    students: SupervisionStudentOption[],
) {
    const studentEmails = useMemo(() => students.map((student) => student.email), [students])
    const [studentEmail, setStudentEmailState] = useState('')

    useEffect(() => {
        if (!courseKey) {
            setStudentEmailState('')
            return
        }

        const stored = parseStoredSupervisionStudentEmail(
            localStorage.getItem(supervisionStudentStorageKey(userId, courseKey)),
            studentEmails,
        )
        setStudentEmailState(stored ?? '')
    }, [userId, courseKey, studentEmails])

    function setStudentEmail(next: string) {
        setStudentEmailState(next)
        if (!courseKey) {
            return
        }

        const storageKey = supervisionStudentStorageKey(userId, courseKey)
        if (next) {
            localStorage.setItem(storageKey, next)
            return
        }
        localStorage.removeItem(storageKey)
    }

    return [studentEmail, setStudentEmail] as const
}
