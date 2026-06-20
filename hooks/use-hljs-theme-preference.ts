'use client'

import { useEffect, useState } from 'react'

import {
    DEFAULT_HLJS_THEME,
    HLJS_THEME_STORAGE_KEY,
    parseHljsThemeSelection,
    type HljsThemeSelection,
} from '@/lib/hljsThemes'

export function useHljsThemePreference() {
    const [highlightTheme, setHighlightThemeState] = useState<HljsThemeSelection>(DEFAULT_HLJS_THEME)

    useEffect(() => {
        const stored = parseHljsThemeSelection(localStorage.getItem(HLJS_THEME_STORAGE_KEY))
        if (stored) {
            setHighlightThemeState(stored)
        }
    }, [])

    function setHighlightTheme(theme: HljsThemeSelection) {
        setHighlightThemeState(theme)
        localStorage.setItem(HLJS_THEME_STORAGE_KEY, theme)
    }

    return [highlightTheme, setHighlightTheme] as const
}
