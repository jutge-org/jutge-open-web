'use client'

import { useAuth } from '@/components/AuthProvider'
import { fetchCommandPaletteCourses, fetchCommandPaletteProblems } from '@/lib/data/commandPalette'
import {
    clearAllRecents,
    clearRecentCourses,
    clearRecentProblems,
    clearRecentSubmissions,
    emptyRecents,
    enrichRecentCourseIcons,
    enrichRecentProblemIcons,
    observeRecentPageMetadata,
    readRecents,
    syncRecentsFromPage,
    writeRecents,
    type RecentsData,
} from '@/lib/recents'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

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

function mergeWithStoredRecents(userId: string, current: RecentsData): RecentsData {
    const stored = readRecents(userId)
    if (current.courses.length === 0 && current.problems.length === 0 && current.submissions.length === 0) {
        return stored
    }

    return current
}

export function RecentsProvider({ children }: RecentsProviderProps) {
    const { user } = useAuth()
    const authenticated = user !== null
    const userId = user?.id ?? null
    const pathname = usePathname() ?? ''
    const [recents, setRecents] = useState<RecentsData>(emptyRecents)

    useEffect(() => {
        if (!userId) {
            setRecents(emptyRecents())
            return
        }

        setRecents(readRecents(userId))
    }, [userId])

    useEffect(() => {
        if (!authenticated || !userId) {
            return
        }

        const activeUserId = userId

        function syncFromPage(record: boolean) {
            setRecents((current) => {
                const base = mergeWithStoredRecents(activeUserId, current)
                const next = syncRecentsFromPage(pathname, base, { record })
                if (next === base) {
                    return current
                }

                writeRecents(activeUserId, next)
                return next
            })
        }

        syncFromPage(true)

        return observeRecentPageMetadata(() => {
            syncFromPage(false)
        })
    }, [authenticated, pathname, userId])

    useEffect(() => {
        if (!authenticated || !userId) {
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
            setRecents((current) => {
                const next = enrichRecentCourseIcons(current, iconByKey)
                if (next === current) {
                    return current
                }

                writeRecents(userId, next)
                return next
            })
        })

        return () => {
            cancelled = true
        }
    }, [authenticated, recents.courses, userId])

    useEffect(() => {
        if (!authenticated || !userId) {
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
            setRecents((current) => {
                const next = enrichRecentProblemIcons(current, iconByNm)
                if (next === current) {
                    return current
                }

                writeRecents(userId, next)
                return next
            })
        })

        return () => {
            cancelled = true
        }
    }, [authenticated, recents.problems, userId])

    function updateRecents(updater: (data: RecentsData) => RecentsData) {
        if (!userId) {
            return
        }

        setRecents((current) => {
            const next = updater(current)
            writeRecents(userId, next)
            return next
        })
    }

    function clearCourses() {
        updateRecents(clearRecentCourses)
    }

    function clearProblems() {
        updateRecents(clearRecentProblems)
    }

    function clearSubmissions() {
        updateRecents(clearRecentSubmissions)
    }

    function clearAll() {
        updateRecents(() => clearAllRecents())
    }

    return (
        <RecentsContext.Provider value={{ recents, clearCourses, clearProblems, clearSubmissions, clearAll }}>
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
