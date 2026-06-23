'use client'

import { AuthToolbar } from '@/components/AuthToolbar'
import { RootShell } from '@/components/RootShell'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AppToaster } from '@/components/AppToaster'
import { JutgeAuthProvider } from '@/providers/JutgeAuthProvider'
import { MainBreadcrumbsInLayout } from './MainBreadcrumbsInLayout'

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
    const currentYear = new Date().getFullYear()

    return (
        <JutgeAuthProvider>
            <ThemeProvider>
                <RootShell
                    header={
                        <header className="sticky top-0 z-50 border-b border-border bg-background">
                            <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                                <MainBreadcrumbsInLayout />
                                <div className="flex items-center gap-4">
                                    <ThemeToggle />
                                    <AuthToolbar />
                                </div>
                            </div>
                        </header>
                    }
                    footer={
                        <footer className="mt-auto border-t border-border bg-background">
                            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <p>
                                    © Universitat Politècnica de Catalunya
                                    <span className="hidden sm:inline"> — BarcelonaTech, {currentYear}</span>
                                </p>
                            </div>
                        </footer>
                    }
                >
                    {children}
                </RootShell>
                <AppToaster />
            </ThemeProvider>
        </JutgeAuthProvider>
    )
}
