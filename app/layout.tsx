import { AppShell } from '@/components/AppShell'
import { AppToaster } from '@/components/AppToaster'
import { AppearancePreferencesProvider } from '@/components/AppearancePreferencesProvider'
import { LayoutWidthProvider } from '@/components/layout/LayoutWidthProvider'
import { SkipLink } from '@/components/SkipLink'
import { ThemeProvider } from '@/components/ThemeProvider'
import { layoutWidthBootstrapScript } from '@/lib/layoutWidth'
import { reducedMotionBootstrapScript } from '@/lib/reducedMotion'
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
            <head>
                <script dangerouslySetInnerHTML={{ __html: layoutWidthBootstrapScript() }} />
                <script dangerouslySetInnerHTML={{ __html: reducedMotionBootstrapScript() }} />
            </head>
            <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
                <SkipLink />
                <ThemeProvider>
                    <LayoutWidthProvider>
                        <AppearancePreferencesProvider>
                            <AppShell>{children}</AppShell>
                            <AppToaster />
                        </AppearancePreferencesProvider>
                    </LayoutWidthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
