'use client'

import { useAuth } from '@/components/AuthProvider'
import {
    hydrateLocalOpenWebSettings,
    hydrateOpenWebSettingsFromApi,
    resetOpenWebSettingsPersistence,
    teardownOpenWebSettingsPersistence,
} from '@/lib/settingsPersistence'
import { syncPageBackground } from '@/lib/pageBackground'
import { syncReducedMotionDataset } from '@/lib/reducedMotion'
import { useOpenWebSettingsStore } from '@/store/openWebSettings'
import { useTheme } from 'next-themes'
import { useEffect, useRef, type ReactNode } from 'react'

function syncLayoutWidthDataset(layoutWidth: string) {
    document.documentElement.dataset.layoutWidth = layoutWidth
}

type SettingsProviderProps = {
    children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
    const { user, loading } = useAuth()
    const { setTheme } = useTheme()
    const previousUserIdRef = useRef<string | null>(null)
    const initializedRef = useRef(false)

    const ready = useOpenWebSettingsStore((state) => state.ready)
    const appearance = useOpenWebSettingsStore((state) => state.settings.appearance)

    useEffect(() => {
        if (loading) {
            return
        }

        const currentUserId = user?.id ?? null
        const previousUserId = previousUserIdRef.current

        if (!initializedRef.current) {
            initializedRef.current = true
            if (currentUserId) {
                void hydrateOpenWebSettingsFromApi()
            } else {
                hydrateLocalOpenWebSettings()
            }
            previousUserIdRef.current = currentUserId
            return
        }

        if (currentUserId === previousUserId) {
            return
        }

        if (currentUserId) {
            void hydrateOpenWebSettingsFromApi()
        } else {
            resetOpenWebSettingsPersistence()
            hydrateLocalOpenWebSettings()
        }

        previousUserIdRef.current = currentUserId
    }, [loading, user?.id])

    useEffect(() => {
        return () => {
            teardownOpenWebSettingsPersistence()
        }
    }, [])

    useEffect(() => {
        if (!ready) {
            return
        }

        setTheme(appearance.theme)
        syncLayoutWidthDataset(appearance.layoutWidth)
        syncReducedMotionDataset(appearance.reducedMotion)
        syncPageBackground(appearance.background)
    }, [appearance.background, appearance.layoutWidth, appearance.reducedMotion, appearance.theme, ready, setTheme])

    return children
}
