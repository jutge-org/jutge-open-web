export const REDUCED_MOTION_STORAGE_KEY = 'jutge-reduced-motion'

export const REDUCED_MOTION_SYSTEM = 'system' as const
export const REDUCED_MOTION_REDUCE = 'reduce' as const
export const REDUCED_MOTION_FULL = 'full' as const

export const REDUCED_MOTION_OPTIONS = [REDUCED_MOTION_SYSTEM, REDUCED_MOTION_REDUCE, REDUCED_MOTION_FULL] as const

export type ReducedMotionPreference = (typeof REDUCED_MOTION_OPTIONS)[number]

export const DEFAULT_REDUCED_MOTION: ReducedMotionPreference = REDUCED_MOTION_SYSTEM

export function parseReducedMotion(value: string | null): ReducedMotionPreference | null {
    if ((REDUCED_MOTION_OPTIONS as readonly string[]).includes(value ?? '')) {
        return value as ReducedMotionPreference
    }

    return null
}

export function syncReducedMotionDataset(preference: ReducedMotionPreference) {
    if (preference === REDUCED_MOTION_SYSTEM) {
        delete document.documentElement.dataset.reducedMotion
        return
    }

    document.documentElement.dataset.reducedMotion = preference
}

export function reducedMotionBootstrapScript(): string {
    return `(function(){try{var m=localStorage.getItem('${REDUCED_MOTION_STORAGE_KEY}');if(m==='reduce'||m==='full')document.documentElement.dataset.reducedMotion=m}catch(e){}})();`
}

export function systemPrefersReducedMotion(): boolean {
    if (typeof window === 'undefined') {
        return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isMotionReduced(
    preference: ReducedMotionPreference,
    systemPrefersReduced: boolean = systemPrefersReducedMotion(),
): boolean {
    if (preference === REDUCED_MOTION_FULL) {
        return false
    }

    if (preference === REDUCED_MOTION_REDUCE) {
        return true
    }

    return systemPrefersReduced
}
