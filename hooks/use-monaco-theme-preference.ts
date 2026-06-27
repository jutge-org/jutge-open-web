'use client'

import { useAppearancePreferences } from '@/components/AppearancePreferencesProvider'

export function useMonacoThemePreference() {
    const { monacoTheme, setMonacoTheme } = useAppearancePreferences()
    return [monacoTheme, setMonacoTheme] as const
}
