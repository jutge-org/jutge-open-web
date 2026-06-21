import type { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

import { isMonacoBuiltinTheme, isMonacoCustomTheme, type MonacoCustomThemeId } from '@/lib/monaco/themes'

const registeredThemes = new Set<string>()

const THEME_LOADERS: Record<MonacoCustomThemeId, () => Promise<unknown>> = {
    monokai: () => import('@/lib/monaco/theme-data/Monokai.json'),
    dracula: () => import('@/lib/monaco/theme-data/Dracula.json'),
    'github-dark': () => import('@/lib/monaco/theme-data/GitHub Dark.json'),
    'github-light': () => import('@/lib/monaco/theme-data/GitHub Light.json'),
    nord: () => import('@/lib/monaco/theme-data/Nord.json'),
    'night-owl': () => import('@/lib/monaco/theme-data/Night Owl.json'),
    'solarized-dark': () => import('@/lib/monaco/theme-data/Solarized-dark.json'),
    'solarized-light': () => import('@/lib/monaco/theme-data/Solarized-light.json'),
    cobalt: () => import('@/lib/monaco/theme-data/Cobalt.json'),
    'tomorrow-night': () => import('@/lib/monaco/theme-data/Tomorrow-Night.json'),
}

export async function ensureMonacoThemeRegistered(monaco: Monaco, themeId: string): Promise<void> {
    if (isMonacoBuiltinTheme(themeId) || registeredThemes.has(themeId)) {
        return
    }

    if (!isMonacoCustomTheme(themeId)) {
        return
    }

    const loadTheme = THEME_LOADERS[themeId]
    if (!loadTheme) {
        return
    }

    const themeModule = (await loadTheme()) as { default?: editor.IStandaloneThemeData } & editor.IStandaloneThemeData
    const themeData = (themeModule.default ?? themeModule) as editor.IStandaloneThemeData

    monaco.editor.defineTheme(themeId, themeData)
    registeredThemes.add(themeId)
}
