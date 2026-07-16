import { AppShell } from '@/components/AppShell'
import { AppToaster } from '@/components/AppToaster'
import { AppearancePreferencesProvider } from '@/components/AppearancePreferencesProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { LayoutWidthProvider } from '@/components/layout/LayoutWidthProvider'
import { PageBackground } from '@/components/PageBackground'
import { SettingsProvider } from '@/components/SettingsProvider'
import { SkipLink } from '@/components/SkipLink'
import { ThemeProvider } from '@/components/ThemeProvider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Jutge.org',
    description: 'The Open client for Jutge.org',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-background" suppressHydrationWarning>
            <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
                <SkipLink />
                <ThemeProvider>
                    <AuthProvider>
                        <SettingsProvider>
                            <LayoutWidthProvider>
                                <AppearancePreferencesProvider>
                                    <PageBackground />
                                    <AppShell>{children}</AppShell>
                                    <AppToaster />
                                </AppearancePreferencesProvider>
                            </LayoutWidthProvider>
                        </SettingsProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
