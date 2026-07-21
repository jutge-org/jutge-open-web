'use client'

import { useAuth } from '@/components/AuthProvider'
import { fetchCommandPaletteCourses, fetchCommandPaletteProblems } from '@/lib/data/commandPalette'
import {
    addRecentList,
    enrichRecentCourses,
    enrichRecentProblems,
    emptyRecents,
    observeRecentPageMetadata,
    syncRecentsFromPage,
    type RecentListItem,
    type RecentsData,
} from '@/lib/recents'
import { useOpenWebRecents, useOpenWebSettingsReady, useOpenWebSettingsStore } from '@/store/openWebSettings'
import { usePathname } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, type ReactNode } from 'react'

type RecentsContextValue = {
    recents: RecentsData
    /** Lists have no route of their own, so pages record them explicitly. */
    recordList: (item: RecentListItem) => void
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

        // The title is unresolved when it still equals the course key.
        if (!recents.courses.some((course) => !course.iconUrl || course.title === course.courseKey)) {
            return
        }

        let cancelled = false

        void fetchCommandPaletteCourses().then((allCourses) => {
            if (cancelled) {
                return
            }

            const metaByKey = new Map(
                allCourses.map((course) => [course.course_key, { title: course.title, iconUrl: course.iconUrl }]),
            )
            setRecents((current) => enrichRecentCourses(current, metaByKey))
        })

        return () => {
            cancelled = true
        }
    }, [authenticated, ready, recents.courses, setRecents])

    useEffect(() => {
        if (!authenticated || !ready) {
            return
        }

        // The title is unresolved when it still equals the problem name.
        if (!recents.problems.some((problem) => !problem.iconUrl || problem.title === problem.problemNm)) {
            return
        }

        let cancelled = false

        void fetchCommandPaletteProblems().then((allProblems) => {
            if (cancelled) {
                return
            }

            const metaByNm = new Map(
                allProblems.map(
                    (problem) =>
                        [problem.problem_nm, { title: problem.title, iconUrl: problem.iconUrl ?? undefined }] as const,
                ),
            )
            setRecents((current) => enrichRecentProblems(current, metaByNm))
        })

        return () => {
            cancelled = true
        }
    }, [authenticated, ready, recents.problems, setRecents])

    const visibleRecents = authenticated ? recents : emptyRecents()

    const recordList = useCallback(
        (item: RecentListItem) => {
            if (!authenticated || !ready) {
                return
            }

            setRecents((current) => addRecentList(current, item))
        },
        [authenticated, ready, setRecents],
    )

    return (
        <RecentsContext.Provider
            value={{
                recents: visibleRecents,
                recordList,
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
