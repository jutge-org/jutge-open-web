'use client'

import { useEffect, useMemo, useState } from 'react'

import { courseListAccordionStorageKey, parseCourseListAccordionOpenItems } from '@/lib/courses'
import { useOpenWebSettingsStore } from '@/store/openWebSettings'

export function useCourseListAccordionPreference(courseKey: string, listNames: string[]) {
    const defaultOpen = useMemo(() => (listNames.length > 0 ? [listNames[0]] : []), [listNames])
    const ready = useOpenWebSettingsStore((state) => state.ready)
    const storedOpenItems = useOpenWebSettingsStore((state) => state.settings.ui.courseListAccordions[courseKey])
    const setCourseListAccordionOpenItems = useOpenWebSettingsStore((state) => state.setCourseListAccordionOpenItems)

    const [openItems, setOpenItemsState] = useState<string[]>(defaultOpen)

    useEffect(() => {
        if (!ready) {
            return
        }

        const stored = parseCourseListAccordionOpenItems(
            storedOpenItems ? JSON.stringify(storedOpenItems) : null,
            listNames,
            defaultOpen,
        )
        setOpenItemsState(stored)
    }, [courseKey, defaultOpen, listNames, ready, storedOpenItems])

    function setOpenItems(updater: string[] | ((prev: string[]) => string[])) {
        const next = typeof updater === 'function' ? updater(openItems) : updater
        setOpenItemsState(next)
        setCourseListAccordionOpenItems(courseKey, next)
    }

    return [openItems, setOpenItems] as const
}

export { courseListAccordionStorageKey }
