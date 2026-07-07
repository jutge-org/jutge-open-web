'use client'

import { useLayoutWidth } from '@/components/layout/LayoutWidthProvider'
import { clearAppearanceStorage } from '@/lib/appearanceDefaults'
import { DEFAULT_FONT_SCALE, parseFontScale } from '@/lib/fontScale'
import {
    DEFAULT_HLJS_THEME,
    HLJS_THEME_STORAGE_KEY,
    parseHljsThemeSelection,
    type HljsThemeSelection,
} from '@/lib/hljsThemes'
import { DEFAULT_LAYOUT_WIDTH } from '@/lib/layoutWidth'
import {
    DEFAULT_MONACO_THEME,
    MONACO_THEME_STORAGE_KEY,
    parseMonacoThemeSelection,
    type MonacoThemeSelection,
} from '@/lib/monaco/themes'
import { createDefaultFontScales, READING_FONT_SCALE_KEYS, type ReadingFontScaleKey } from '@/lib/readingFontScale'
import {
    DEFAULT_REDUCED_MOTION,
    parseReducedMotion,
    REDUCED_MOTION_STORAGE_KEY,
    syncReducedMotionDataset,
    type ReducedMotionPreference,
} from '@/lib/reducedMotion'
import {
    DEFAULT_SOUND_EFFECTS,
    parseSoundEffects,
    SOUND_EFFECTS_STORAGE_KEY,
    type SoundEffectsPreference,
} from '@/lib/soundEffects'
import { useTheme } from 'next-themes'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type FontScales = Record<ReadingFontScaleKey, number>

type AppearancePreferencesContextValue = {
    monacoTheme: MonacoThemeSelection
    setMonacoTheme: (theme: MonacoThemeSelection) => void
    hljsTheme: HljsThemeSelection
    setHljsTheme: (theme: HljsThemeSelection) => void
    fontScales: FontScales
    setFontScale: (storageKey: ReadingFontScaleKey, updater: number | ((prev: number) => number)) => void
    setReadingFontScalePreset: (scale: number) => void
    reducedMotion: ReducedMotionPreference
    setReducedMotion: (preference: ReducedMotionPreference) => void
    soundEffects: SoundEffectsPreference
    setSoundEffects: (preference: SoundEffectsPreference) => void
    resetAppearanceDefaults: () => void
}

const AppearancePreferencesContext = createContext<AppearancePreferencesContextValue | null>(null)

function readStoredFontScales(): FontScales {
    if (typeof window === 'undefined') {
        return createDefaultFontScales()
    }

    const defaults = createDefaultFontScales()
    for (const key of READING_FONT_SCALE_KEYS) {
        const stored = parseFontScale(localStorage.getItem(key))
        if (stored !== null) {
            defaults[key] = stored
        }
    }

    return defaults
}

function readStoredMonacoTheme(): MonacoThemeSelection {
    if (typeof window === 'undefined') {
        return DEFAULT_MONACO_THEME
    }

    return parseMonacoThemeSelection(localStorage.getItem(MONACO_THEME_STORAGE_KEY)) ?? DEFAULT_MONACO_THEME
}

function readStoredHljsTheme(): HljsThemeSelection {
    if (typeof window === 'undefined') {
        return DEFAULT_HLJS_THEME
    }

    return parseHljsThemeSelection(localStorage.getItem(HLJS_THEME_STORAGE_KEY)) ?? DEFAULT_HLJS_THEME
}

function readStoredReducedMotion(): ReducedMotionPreference {
    if (typeof window === 'undefined') {
        return DEFAULT_REDUCED_MOTION
    }

    return parseReducedMotion(localStorage.getItem(REDUCED_MOTION_STORAGE_KEY)) ?? DEFAULT_REDUCED_MOTION
}

function readStoredSoundEffects(): SoundEffectsPreference {
    if (typeof window === 'undefined') {
        return DEFAULT_SOUND_EFFECTS
    }

    return parseSoundEffects(localStorage.getItem(SOUND_EFFECTS_STORAGE_KEY)) ?? DEFAULT_SOUND_EFFECTS
}

export function AppearancePreferencesProvider({ children }: { children: ReactNode }) {
    const { setTheme } = useTheme()
    const { setLayoutWidth } = useLayoutWidth()
    const [monacoTheme, setMonacoThemeState] = useState<MonacoThemeSelection>(DEFAULT_MONACO_THEME)
    const [hljsTheme, setHljsThemeState] = useState<HljsThemeSelection>(DEFAULT_HLJS_THEME)
    const [fontScales, setFontScalesState] = useState<FontScales>(createDefaultFontScales)
    const [reducedMotion, setReducedMotionState] = useState<ReducedMotionPreference>(DEFAULT_REDUCED_MOTION)
    const [soundEffects, setSoundEffectsState] = useState<SoundEffectsPreference>(DEFAULT_SOUND_EFFECTS)

    useEffect(() => {
        setMonacoThemeState(readStoredMonacoTheme())
        setHljsThemeState(readStoredHljsTheme())
        setFontScalesState(readStoredFontScales())
        const storedReducedMotion = readStoredReducedMotion()
        setReducedMotionState(storedReducedMotion)
        syncReducedMotionDataset(storedReducedMotion)
        setSoundEffectsState(readStoredSoundEffects())
    }, [])

    function setMonacoTheme(theme: MonacoThemeSelection) {
        setMonacoThemeState(theme)
        localStorage.setItem(MONACO_THEME_STORAGE_KEY, theme)
    }

    function setHljsTheme(theme: HljsThemeSelection) {
        setHljsThemeState(theme)
        localStorage.setItem(HLJS_THEME_STORAGE_KEY, theme)
    }

    function setFontScale(storageKey: ReadingFontScaleKey, updater: number | ((prev: number) => number)) {
        setFontScalesState((prev) => {
            const nextValue = typeof updater === 'function' ? updater(prev[storageKey]) : updater
            localStorage.setItem(storageKey, String(nextValue))
            return { ...prev, [storageKey]: nextValue }
        })
    }

    function setReadingFontScalePreset(scale: number) {
        setFontScalesState(() => {
            const next = createDefaultFontScales()
            for (const key of READING_FONT_SCALE_KEYS) {
                next[key] = scale
                localStorage.setItem(key, String(scale))
            }
            return next
        })
    }

    function setReducedMotion(preference: ReducedMotionPreference) {
        setReducedMotionState(preference)
        localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, preference)
        syncReducedMotionDataset(preference)
    }

    function setSoundEffects(preference: SoundEffectsPreference) {
        setSoundEffectsState(preference)
        localStorage.setItem(SOUND_EFFECTS_STORAGE_KEY, preference)
    }

    function resetAppearanceDefaults() {
        clearAppearanceStorage()
        setMonacoThemeState(DEFAULT_MONACO_THEME)
        setHljsThemeState(DEFAULT_HLJS_THEME)
        setFontScalesState(createDefaultFontScales())
        setReducedMotionState(DEFAULT_REDUCED_MOTION)
        syncReducedMotionDataset(DEFAULT_REDUCED_MOTION)
        setSoundEffectsState(DEFAULT_SOUND_EFFECTS)
        setTheme('system')
        setLayoutWidth(DEFAULT_LAYOUT_WIDTH)
    }

    return (
        <AppearancePreferencesContext.Provider
            value={{
                monacoTheme,
                setMonacoTheme,
                hljsTheme,
                setHljsTheme,
                fontScales,
                setFontScale,
                setReadingFontScalePreset,
                reducedMotion,
                setReducedMotion,
                soundEffects,
                setSoundEffects,
                resetAppearanceDefaults,
            }}
        >
            {children}
        </AppearancePreferencesContext.Provider>
    )
}

export function useAppearancePreferences() {
    const context = useContext(AppearancePreferencesContext)
    if (!context) {
        throw new Error('useAppearancePreferences must be used within an AppearancePreferencesProvider')
    }

    return context
}

export function useFontScaleFromPreferences(storageKey: ReadingFontScaleKey) {
    const { fontScales, setFontScale } = useAppearancePreferences()

    function setFontScaleForKey(updater: number | ((prev: number) => number)) {
        setFontScale(storageKey, updater)
    }

    return [fontScales[storageKey] ?? DEFAULT_FONT_SCALE, setFontScaleForKey] as const
}
