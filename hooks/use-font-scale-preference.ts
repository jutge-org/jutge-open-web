'use client'

import { useFontScaleFromPreferences } from '@/components/AppearancePreferencesProvider'
import type { ReadingFontScaleKey } from '@/lib/readingFontScale'

export function useFontScalePreference(storageKey: string) {
    return useFontScaleFromPreferences(storageKey as ReadingFontScaleKey)
}
