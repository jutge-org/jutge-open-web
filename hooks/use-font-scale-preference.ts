'use client'

import { useEffect, useState } from 'react'

import { DEFAULT_FONT_SCALE, parseFontScale } from '@/lib/fontScale'

export function useFontScalePreference(storageKey: string) {
    const [fontScale, setFontScaleState] = useState(DEFAULT_FONT_SCALE)

    useEffect(() => {
        const stored = parseFontScale(localStorage.getItem(storageKey))
        if (stored !== null) {
            setFontScaleState(stored)
        }
    }, [storageKey])

    function setFontScale(updater: number | ((prev: number) => number)) {
        setFontScaleState((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater
            localStorage.setItem(storageKey, String(next))
            return next
        })
    }

    return [fontScale, setFontScale] as const
}
