export const CONTEXTUAL_HEADER_GRADIENTS_ON = 'on' as const
export const CONTEXTUAL_HEADER_GRADIENTS_OFF = 'off' as const

export const CONTEXTUAL_HEADER_GRADIENTS_OPTIONS = [
    CONTEXTUAL_HEADER_GRADIENTS_ON,
    CONTEXTUAL_HEADER_GRADIENTS_OFF,
] as const

export type ContextualHeaderGradientsPreference = (typeof CONTEXTUAL_HEADER_GRADIENTS_OPTIONS)[number]

export const DEFAULT_CONTEXTUAL_HEADER_GRADIENTS: ContextualHeaderGradientsPreference =
    CONTEXTUAL_HEADER_GRADIENTS_ON

export function parseContextualHeaderGradients(
    value: string | null,
): ContextualHeaderGradientsPreference | null {
    if ((CONTEXTUAL_HEADER_GRADIENTS_OPTIONS as readonly string[]).includes(value ?? '')) {
        return value as ContextualHeaderGradientsPreference
    }

    return null
}

export function isContextualHeaderGradientsEnabled(
    preference: ContextualHeaderGradientsPreference,
): boolean {
    return preference === CONTEXTUAL_HEADER_GRADIENTS_ON
}
