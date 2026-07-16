'use client'

import { pageBackgroundImageUrl } from '@/lib/pageBackground'
import { useOpenWebSettingsReady, useOpenWebSettingsStore } from '@/store/openWebSettings'

/**
 * Full-viewport page background image. Rendered as a fixed layer so it stays
 * visible behind transparent body/chrome when a background preference is set.
 */
export function PageBackground() {
    const ready = useOpenWebSettingsReady()
    const background = useOpenWebSettingsStore((state) => state.settings.appearance.background)

    if (!ready || background <= 0) {
        return null
    }

    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${pageBackgroundImageUrl(background)})` }}
        />
    )
}
