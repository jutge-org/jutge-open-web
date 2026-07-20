'use client'

import { DEFAULT_LAYOUT_WIDTH } from '@/lib/layoutWidth'
import type { ThemePreference } from '@/lib/openWebSettings'
import { DEFAULT_FONT_SCALE } from '@/lib/fontScale'
import { syncReducedMotionDataset } from '@/lib/reducedMotion'
import { useOpenWebAppearance, useOpenWebSettingsStore } from '@/store/openWebSettings'
import { useTheme } from 'next-themes'
import { createContext, useContext, type ReactNode } from 'react'

import type { HljsThemeSelection } from '@/lib/hljsThemes'
import type { MonacoThemeSelection } from '@/lib/monaco/themes'
import type { ReadingFontScaleKey } from '@/lib/readingFontScale'
import type { ReducedMotionPreference } from '@/lib/reducedMotion'
import type { SoundEffectsPreference } from '@/lib/soundEffects'
import type { ContextualHeaderGradientsPreference } from '@/lib/contextualHeaderGradients'

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
    contextualHeaderGradients: ContextualHeaderGradientsPreference
    setContextualHeaderGradients: (preference: ContextualHeaderGradientsPreference) => void
    resetAppearanceDefaults: () => void
}

const AppearancePreferencesContext = createContext<AppearancePreferencesContextValue | null>(null)

export function AppearancePreferencesProvider({ children }: { children: ReactNode }) {
    const { setTheme } = useTheme()
    const appearance = useOpenWebAppearance()
    const setMonacoTheme = useOpenWebSettingsStore((state) => state.setMonacoTheme)
    const setHljsTheme = useOpenWebSettingsStore((state) => state.setHljsTheme)
    const setFontScale = useOpenWebSettingsStore((state) => state.setFontScale)
    const setReadingFontScalePreset = useOpenWebSettingsStore((state) => state.setReadingFontScalePreset)
    const setReducedMotion = useOpenWebSettingsStore((state) => state.setReducedMotion)
    const setSoundEffects = useOpenWebSettingsStore((state) => state.setSoundEffects)
    const setContextualHeaderGradients = useOpenWebSettingsStore((state) => state.setContextualHeaderGradients)
    const resetAppearanceDefaultsInStore = useOpenWebSettingsStore((state) => state.resetAppearanceDefaults)
    const setLayoutWidth = useOpenWebSettingsStore((state) => state.setLayoutWidth)
    const setStoredTheme = useOpenWebSettingsStore((state) => state.setTheme)

    function setReducedMotionPreference(preference: ReducedMotionPreference) {
        setReducedMotion(preference)
        syncReducedMotionDataset(preference)
    }

    function resetAppearanceDefaults() {
        resetAppearanceDefaultsInStore()
        setLayoutWidth(DEFAULT_LAYOUT_WIDTH)
        setStoredTheme('system')
        setTheme('system')
        syncReducedMotionDataset('system')
    }

    return (
        <AppearancePreferencesContext.Provider
            value={{
                monacoTheme: appearance.monacoTheme,
                setMonacoTheme,
                hljsTheme: appearance.hljsTheme,
                setHljsTheme,
                fontScales: appearance.fontScales,
                setFontScale,
                setReadingFontScalePreset,
                reducedMotion: appearance.reducedMotion,
                setReducedMotion: setReducedMotionPreference,
                soundEffects: appearance.soundEffects,
                setSoundEffects,
                contextualHeaderGradients: appearance.contextualHeaderGradients,
                setContextualHeaderGradients,
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

export function useAppearanceThemePreference() {
    const { setTheme } = useTheme()
    const theme = useOpenWebSettingsStore((state) => state.settings.appearance.theme)
    const setStoredTheme = useOpenWebSettingsStore((state) => state.setTheme)

    function setAppearanceTheme(nextTheme: ThemePreference) {
        setStoredTheme(nextTheme)
        setTheme(nextTheme)
    }

    return [theme, setAppearanceTheme] as const
}
