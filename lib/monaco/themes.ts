export const MONACO_BUILTIN_THEMES = ['vs', 'vs-dark', 'hc-black', 'hc-light'] as const

export type MonacoBuiltinThemeId = (typeof MONACO_BUILTIN_THEMES)[number]

export const MONACO_CUSTOM_THEMES = [
    'monokai',
    'dracula',
    'github-dark',
    'github-light',
    'nord',
    'night-owl',
    'solarized-dark',
    'solarized-light',
    'cobalt',
    'tomorrow-night',
] as const

export type MonacoCustomThemeId = (typeof MONACO_CUSTOM_THEMES)[number]

export const DEFAULT_MONACO_THEME = 'auto' as const

export type MonacoThemeSelection = typeof DEFAULT_MONACO_THEME | MonacoBuiltinThemeId | MonacoCustomThemeId

export const MONACO_THEME_STORAGE_KEY = 'submission-monaco-theme'

const MONACO_THEME_LABELS: Record<MonacoBuiltinThemeId | MonacoCustomThemeId, string> = {
    vs: 'Visual Studio Light',
    'vs-dark': 'Visual Studio Dark',
    'hc-black': 'High Contrast Dark',
    'hc-light': 'High Contrast Light',
    monokai: 'Monokai',
    dracula: 'Dracula',
    'github-dark': 'GitHub Dark',
    'github-light': 'GitHub Light',
    nord: 'Nord',
    'night-owl': 'Night Owl',
    'solarized-dark': 'Solarized Dark',
    'solarized-light': 'Solarized Light',
    cobalt: 'Cobalt',
    'tomorrow-night': 'Tomorrow Night',
}

export function isMonacoBuiltinTheme(theme: string): theme is MonacoBuiltinThemeId {
    return (MONACO_BUILTIN_THEMES as readonly string[]).includes(theme)
}

export function isMonacoCustomTheme(theme: string): theme is MonacoCustomThemeId {
    return (MONACO_CUSTOM_THEMES as readonly string[]).includes(theme)
}

export function parseMonacoThemeSelection(value: string | null): MonacoThemeSelection | null {
    if (!value) {
        return null
    }

    if (value === DEFAULT_MONACO_THEME || isMonacoBuiltinTheme(value) || isMonacoCustomTheme(value)) {
        return value
    }

    return null
}

export function resolveMonacoEditorTheme(
    selection: MonacoThemeSelection,
    resolvedAppTheme: string | undefined,
): string {
    if (selection === 'auto') {
        return resolvedAppTheme === 'dark' ? 'vs-dark' : 'vs'
    }

    return selection
}

export function formatMonacoThemeLabel(themeId: MonacoBuiltinThemeId | MonacoCustomThemeId): string {
    return MONACO_THEME_LABELS[themeId]
}
