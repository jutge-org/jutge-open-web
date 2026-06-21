'use client'

import { useEffect, useMemo, useState } from 'react'

import { courseListAccordionStorageKey, parseCourseListAccordionOpenItems } from '@/lib/courses'

export function useCourseListAccordionPreference(courseKey: string, listNames: string[]) {
    const defaultOpen = useMemo(
        () => (listNames.length > 0 ? [listNames[0]] : []),
        [listNames],
    )

    const [openItems, setOpenItemsState] = useState<string[]>(defaultOpen)

    useEffect(() => {
        const stored = parseCourseListAccordionOpenItems(
            localStorage.getItem(courseListAccordionStorageKey(courseKey)),
            listNames,
            defaultOpen,
        )
        setOpenItemsState(stored)
    }, [courseKey, listNames, defaultOpen])

    function setOpenItems(updater: string[] | ((prev: string[]) => string[])) {
        setOpenItemsState((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater
            localStorage.setItem(courseListAccordionStorageKey(courseKey), JSON.stringify(next))
            return next
        })
    }

    return [openItems, setOpenItems] as const
}
