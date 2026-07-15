import { fetchOpenWebSettings, saveOpenWebSettings } from '@/lib/data/settingsActions'
import {
    clearLegacySettingsStorage,
    clearLocalOpenWebSettings,
    createDefaultOpenWebSettings,
    LOCAL_SETTINGS_STORAGE_KEY,
    readLocalOpenWebSettings,
    writeLocalOpenWebSettings,
    type OpenWebSettings,
} from '@/lib/openWebSettings'
import { useOpenWebSettingsStore } from '@/store/openWebSettings'

const SAVE_DEBOUNCE_MS = 800
const MAX_SAVE_RETRIES = 3

type PersistenceMode = 'local' | 'api' | 'none'

let persistenceMode: PersistenceMode = 'none'
let saveTimeoutId: ReturnType<typeof setTimeout> | undefined
let pendingSave: OpenWebSettings | null = null
let saveGeneration = 0
let unsubscribe: (() => void) | undefined

function cancelPendingSave() {
    if (saveTimeoutId !== undefined) {
        clearTimeout(saveTimeoutId)
        saveTimeoutId = undefined
    }

    pendingSave = null
}

async function saveWithRetry(settings: OpenWebSettings, generation: number): Promise<void> {
    for (let attempt = 0; attempt < MAX_SAVE_RETRIES; attempt += 1) {
        if (generation !== saveGeneration) {
            return
        }

        try {
            await saveOpenWebSettings(settings)
            return
        } catch {
            if (attempt === MAX_SAVE_RETRIES - 1) {
                return
            }

            await new Promise((resolve) => {
                setTimeout(resolve, 500 * (attempt + 1))
            })
        }
    }
}

function flushPendingSave() {
    if (persistenceMode === 'none' || !pendingSave) {
        return
    }

    const settings = pendingSave
    pendingSave = null
    saveTimeoutId = undefined

    if (persistenceMode === 'local') {
        writeLocalOpenWebSettings(settings)
        return
    }

    const generation = saveGeneration
    void saveWithRetry(settings, generation)
}

function scheduleSave(settings: OpenWebSettings) {
    if (persistenceMode === 'none') {
        return
    }

    pendingSave = settings
    if (saveTimeoutId !== undefined) {
        clearTimeout(saveTimeoutId)
    }

    saveTimeoutId = setTimeout(flushPendingSave, SAVE_DEBOUNCE_MS)
}

function subscribeToStoreChanges() {
    unsubscribe?.()

    unsubscribe = useOpenWebSettingsStore.subscribe((state, previousState) => {
        if (!state.ready || !state.dirty || state.settings === previousState.settings) {
            return
        }

        scheduleSave(state.settings)
    })
}

export function setSettingsPersistenceMode(mode: PersistenceMode) {
    if (mode === persistenceMode) {
        return
    }

    cancelPendingSave()
    saveGeneration += 1
    persistenceMode = mode

    if (mode === 'none') {
        unsubscribe?.()
        unsubscribe = undefined
        return
    }

    subscribeToStoreChanges()
}

export function hydrateLocalOpenWebSettings() {
    const hadUnifiedSettings =
        typeof window !== 'undefined' && localStorage.getItem(LOCAL_SETTINGS_STORAGE_KEY) !== null
    const settings = readLocalOpenWebSettings()
    useOpenWebSettingsStore.getState().hydrate(settings, { dirty: false })
    if (!hadUnifiedSettings) {
        writeLocalOpenWebSettings(settings)
        clearLegacySettingsStorage()
    }
    setSettingsPersistenceMode('local')
}

export async function hydrateOpenWebSettingsFromApi(): Promise<boolean> {
    setSettingsPersistenceMode('none')

    const settings = await fetchOpenWebSettings()
    if (!settings) {
        useOpenWebSettingsStore.getState().hydrate(createDefaultOpenWebSettings(), { dirty: false })
        clearLocalOpenWebSettings()
        clearLegacySettingsStorage()
        setSettingsPersistenceMode('api')
        return false
    }

    useOpenWebSettingsStore.getState().hydrate(settings, { dirty: false })
    clearLocalOpenWebSettings()
    clearLegacySettingsStorage()
    setSettingsPersistenceMode('api')
    return true
}

export function resetOpenWebSettingsPersistence() {
    cancelPendingSave()
    saveGeneration += 1
    setSettingsPersistenceMode('none')
    clearLocalOpenWebSettings()
    useOpenWebSettingsStore.getState().reset()
}

export function flushOpenWebSettingsPersistence() {
    flushPendingSave()
}

export function teardownOpenWebSettingsPersistence() {
    cancelPendingSave()
    saveGeneration += 1
    persistenceMode = 'none'
    unsubscribe?.()
    unsubscribe = undefined
}
