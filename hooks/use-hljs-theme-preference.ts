'use client'

import { useAppearancePreferences } from '@/components/AppearancePreferencesProvider'

export function useHljsThemePreference() {
    const { hljsTheme, setHljsTheme } = useAppearancePreferences()
    return [hljsTheme, setHljsTheme] as const
}
