'use client'

import type { ComponentProps } from 'react'
import { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

function ThemeColorModeSync() {
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        if (!resolvedTheme) return

        document.documentElement.dataset.colorMode = resolvedTheme
    }, [resolvedTheme])

    return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            // Keep next-themes storage off the legacy `theme` key that settings
            // migration clears; the open-web settings store is the source of truth.
            storageKey="jutge-color-theme"
            {...props}
        >
            <ThemeColorModeSync />
            {children}
        </NextThemesProvider>
    )
}
