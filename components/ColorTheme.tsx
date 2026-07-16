'use client'

import { useLayoutEffect } from 'react'

export type ColorThemeId = 'instructor' | 'administrator' | 'supervision'

/**
 * Applies a section color theme (palette) on `<html>` while mounted.
 * Independent of light/dark color mode — both variants are defined in CSS.
 */
export function ColorTheme({ theme }: { theme: ColorThemeId }) {
    // Apply before paint when possible so the first frame already uses the section palette.
    if (typeof document !== 'undefined') {
        document.documentElement.dataset.colorTheme = theme
    }

    useLayoutEffect(() => {
        const root = document.documentElement
        root.dataset.colorTheme = theme
        return () => {
            if (root.dataset.colorTheme === theme) {
                delete root.dataset.colorTheme
            }
        }
    }, [theme])

    return null
}
