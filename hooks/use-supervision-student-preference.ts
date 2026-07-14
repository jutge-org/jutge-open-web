'use client'

import { useEffect, useMemo, useState } from 'react'

import { parseStoredSupervisionStudentEmail, type SupervisionStudentOption } from '@/lib/supervision'
import { useOpenWebSettingsStore } from '@/store/openWebSettings'

export function useSupervisionStudentPreference(
    _userId: string,
    courseKey: string,
    students: SupervisionStudentOption[],
) {
    const studentEmails = useMemo(() => students.map((student) => student.email), [students])
    const ready = useOpenWebSettingsStore((state) => state.ready)
    const storedStudentEmail = useOpenWebSettingsStore(
        (state) => state.settings.ui.supervisionLastStudentByCourse[courseKey] ?? '',
    )
    const setSupervisionLastStudent = useOpenWebSettingsStore((state) => state.setSupervisionLastStudent)

    const [studentEmail, setStudentEmailState] = useState('')

    useEffect(() => {
        if (!ready) {
            return
        }

        if (!courseKey) {
            setStudentEmailState('')
            return
        }

        const stored = parseStoredSupervisionStudentEmail(storedStudentEmail || null, studentEmails)
        setStudentEmailState(stored ?? '')
    }, [courseKey, ready, storedStudentEmail, studentEmails])

    function setStudentEmail(next: string) {
        setStudentEmailState(next)
        if (!courseKey) {
            return
        }

        setSupervisionLastStudent(courseKey, next)
    }

    return [studentEmail, setStudentEmail] as const
}
