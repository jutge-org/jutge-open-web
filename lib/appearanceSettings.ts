export const APPEARANCE_SETTINGS_OPEN_EVENT = 'jutge:appearance-settings-open'

export function dispatchOpenAppearanceSettings(): void {
    if (typeof window === 'undefined') {
        return
    }
    window.dispatchEvent(new CustomEvent(APPEARANCE_SETTINGS_OPEN_EVENT))
}
