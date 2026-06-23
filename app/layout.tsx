import type { Metadata } from 'next'

import './globals.css'
import { RootLayoutClient } from './RootLayoutClient'

export const metadata: Metadata = {
    title: 'Jutge.org',
    description: 'The Open client for Jutge.org',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-background" suppressHydrationWarning>
            <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    )
}
