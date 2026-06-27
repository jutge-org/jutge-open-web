import { LAYOUT_WIDTH_STORAGE_KEY } from '@/lib/layoutWidth'
import { HLJS_THEME_STORAGE_KEY } from '@/lib/hljsThemes'
import { MONACO_THEME_STORAGE_KEY } from '@/lib/monaco/themes'
import { READING_FONT_SCALE_KEYS } from '@/lib/readingFontScale'
import { REDUCED_MOTION_STORAGE_KEY } from '@/lib/reducedMotion'
import { SOUND_EFFECTS_STORAGE_KEY } from '@/lib/soundEffects'

export const NEXT_THEMES_STORAGE_KEY = 'theme'

export const APPEARANCE_STORAGE_KEYS = [
    LAYOUT_WIDTH_STORAGE_KEY,
    MONACO_THEME_STORAGE_KEY,
    HLJS_THEME_STORAGE_KEY,
    ...READING_FONT_SCALE_KEYS,
    SOUND_EFFECTS_STORAGE_KEY,
    REDUCED_MOTION_STORAGE_KEY,
    NEXT_THEMES_STORAGE_KEY,
] as const

export function clearAppearanceStorage() {
    for (const key of APPEARANCE_STORAGE_KEYS) {
        localStorage.removeItem(key)
    }
}
