export const SOUND_EFFECTS_STORAGE_KEY = 'jutge-sound-effects'

export const SOUND_EFFECTS_ON = 'on' as const
export const SOUND_EFFECTS_OFF = 'off' as const

export const SOUND_EFFECTS_OPTIONS = [SOUND_EFFECTS_ON, SOUND_EFFECTS_OFF] as const

export type SoundEffectsPreference = (typeof SOUND_EFFECTS_OPTIONS)[number]

export const DEFAULT_SOUND_EFFECTS: SoundEffectsPreference = SOUND_EFFECTS_ON

export function parseSoundEffects(value: string | null): SoundEffectsPreference | null {
    if ((SOUND_EFFECTS_OPTIONS as readonly string[]).includes(value ?? '')) {
        return value as SoundEffectsPreference
    }

    return null
}

export function isSoundEffectsEnabled(preference: SoundEffectsPreference): boolean {
    return preference === SOUND_EFFECTS_ON
}
