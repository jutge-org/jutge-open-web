'use client'

import { useAuth } from '@/components/AuthProvider'
import { fetchCommandPaletteCourses, fetchCommandPaletteProblems } from '@/lib/data/commandPalette'
import {
    enrichRecentCourseIcons,
    enrichRecentProblemIcons,
    emptyRecents,
    observeRecentPageMetadata,
    syncRecentsFromPage,
    type RecentsData,
} from '@/lib/recents'
import { useOpenWebRecents, useOpenWebSettingsReady, useOpenWebSettingsStore } from '@/store/openWebSettings'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, type ReactNode } from 'react'

type RecentsContextValue = {
    recents: RecentsData
    clearCourses: () => void
    clearProblems: () => void
    clearSubmissions: () => void
    clearAll: () => void
}

const RecentsContext = createContext<RecentsContextValue | null>(null)

type RecentsProviderProps = {
    children: ReactNode
}

export function RecentsProvider({ children }: RecentsProviderProps) {
    const { user } = useAuth()
    const authenticated = user !== null
    const pathname = usePathname() ?? ''
    const ready = useOpenWebSettingsReady()
    const recents = useOpenWebRecents()
    const setRecents = useOpenWebSettingsStore((state) => state.setRecents)
    const clearRecentCourses = useOpenWebSettingsStore((state) => state.clearRecentCourses)
    const clearRecentProblems = useOpenWebSettingsStore((state) => state.clearRecentProblems)
    const clearRecentSubmissions = useOpenWebSettingsStore((state) => state.clearRecentSubmissions)
    const clearAllRecents = useOpenWebSettingsStore((state) => state.clearAllRecents)

    useEffect(() => {
        if (!authenticated || !ready) {
            return
        }

        function syncFromPage(record: boolean) {
            setRecents((current) => {
                const next = syncRecentsFromPage(pathname, current, { record })
                return next === current ? current : next
            })
        }

        syncFromPage(true)

        return observeRecentPageMetadata(() => {
            syncFromPage(false)
        })
    }, [authenticated, pathname, ready, setRecents])

    useEffect(() => {
        if (!authenticated || !ready) {
            return
        }

        if (!recents.courses.some((course) => !course.iconUrl)) {
            return
        }

        let cancelled = false

        void fetchCommandPaletteCourses().then((allCourses) => {
            if (cancelled) {
                return
            }

            const iconByKey = new Map(allCourses.map((course) => [course.course_key, course.iconUrl]))
            setRecents((current) => enrichRecentCourseIcons(current, iconByKey))
        })

        return () => {
            cancelled = true
        }
    }, [authenticated, ready, recents.courses, setRecents])

    useEffect(() => {
        if (!authenticated || !ready) {
            return
        }

        if (!recents.problems.some((problem) => !problem.iconUrl)) {
            return
        }

        let cancelled = false

        void fetchCommandPaletteProblems().then((allProblems) => {
            if (cancelled) {
                return
            }

            const iconByNm = new Map(
                allProblems.flatMap((problem) =>
                    problem.iconUrl ? [[problem.problem_nm, problem.iconUrl] as const] : [],
                ),
            )
            setRecents((current) => enrichRecentProblemIcons(current, iconByNm))
        })

        return () => {
            cancelled = true
        }
    }, [authenticated, ready, recents.problems, setRecents])

    const visibleRecents = authenticated ? recents : emptyRecents()

    return (
        <RecentsContext.Provider
            value={{
                recents: visibleRecents,
                clearCourses: clearRecentCourses,
                clearProblems: clearRecentProblems,
                clearSubmissions: clearRecentSubmissions,
                clearAll: clearAllRecents,
            }}
        >
            {children}
        </RecentsContext.Provider>
    )
}

export function useRecents() {
    const context = useContext(RecentsContext)
    if (!context) {
        throw new Error('useRecents must be used within a RecentsProvider')
    }

    return context
}
