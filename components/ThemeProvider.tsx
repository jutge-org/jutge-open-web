'use client'

import type { ComponentProps } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem {...props}>
            {children}
        </NextThemesProvider>
    )
}
