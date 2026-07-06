import type { DebugInformation } from '@/lib/jutge_api_client'

const DEBUG_FIELD_KEYS: (keyof DebugInformation)[] = [
    'correction',
    'solution',
    'stderr',
    'stdout',
    'directories',
]

export function hasDebugInformation(data: DebugInformation | null | undefined): boolean {
    if (!data) {
        return false
    }

    return DEBUG_FIELD_KEYS.some((key) => data[key] != null)
}
