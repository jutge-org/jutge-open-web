'use client'

import { useEffect, useState } from 'react'

import {
    DEFAULT_MONACO_THEME,
    MONACO_THEME_STORAGE_KEY,
    parseMonacoThemeSelection,
    type MonacoThemeSelection,
} from '@/lib/monaco/themes'

export function useMonacoThemePreference() {
    const [editorTheme, setEditorThemeState] = useState<MonacoThemeSelection>(DEFAULT_MONACO_THEME)

    useEffect(() => {
        const stored = parseMonacoThemeSelection(localStorage.getItem(MONACO_THEME_STORAGE_KEY))
        if (stored) {
            setEditorThemeState(stored)
        }
    }, [])

    function setEditorTheme(theme: MonacoThemeSelection) {
        setEditorThemeState(theme)
        localStorage.setItem(MONACO_THEME_STORAGE_KEY, theme)
    }

    return [editorTheme, setEditorTheme] as const
}
