'use client'

import { AuthToolbar } from '@/components/AuthToolbar'
import { ReportIssueButton } from '@/components/ReportIssueButton'
import { CommandPalette } from '@/components/CommandPalette'
import { AppearanceSettingsDialog } from '@/components/AppearanceSettingsDialog'
import { useAppearancePreferences } from '@/components/AppearancePreferencesProvider'
import { RecentMenu } from '@/components/RecentMenu'
import { RecentsProvider } from '@/components/RecentsProvider'
import { AppFooter } from '@/components/layout/AppFooter'
import { LayoutWidthContainer } from '@/components/layout/LayoutWidthContainer'
import { RootShell } from '@/components/RootShell'
import { MainBreadcrumbsInLayout } from '@/app/MainBreadcrumbsInLayout'
import { useAuth } from '@/components/AuthProvider'
import { isContextualHeaderGradientsEnabled } from '@/lib/contextualHeaderGradients'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

function headerBarClassName(pathname: string, gradientsEnabled: boolean): string {
    const base = 'sticky top-0 z-50 border-b border-border'

    if (gradientsEnabled && pathname.startsWith('/administrator')) {
        return cn(
            base,
            'bg-gradient-to-r from-purple-300 via-violet-200 to-fuchsia-100',
            'dark:from-purple-950 dark:via-violet-900/80 dark:to-fuchsia-950/60',
        )
    }
    if (gradientsEnabled && pathname.startsWith('/instructor')) {
        return cn(
            base,
            'bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-100',
            'dark:from-orange-950 dark:via-amber-900/80 dark:to-yellow-950/60',
        )
    }
    if (gradientsEnabled && pathname.startsWith('/supervision')) {
        return cn(
            base,
            'bg-gradient-to-r from-emerald-300 via-teal-200 to-green-100',
            'dark:from-emerald-950 dark:via-teal-900/80 dark:to-green-950/60',
        )
    }

    return cn(base, 'bg-background')
}

function AppShellInner({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const authenticated = user !== null
    const pathname = usePathname() ?? ''
    const { contextualHeaderGradients } = useAppearancePreferences()
    const gradientsEnabled = isContextualHeaderGradientsEnabled(contextualHeaderGradients)

    return (
        <RecentsProvider>
            <RootShell
                header={
                    <header className={headerBarClassName(pathname, gradientsEnabled)}>
                        <LayoutWidthContainer className="flex h-11 items-center justify-between gap-4 px-4 sm:px-6">
                            <MainBreadcrumbsInLayout />
                            <div className="flex items-center gap-0">
                                {authenticated ? <ReportIssueButton /> : null}
                                <CommandPalette />
                                {authenticated ? <RecentMenu /> : null}
                                <AppearanceSettingsDialog />
                                <AuthToolbar />
                            </div>
                        </LayoutWidthContainer>
                    </header>
                }
                footer={<AppFooter />}
            >
                {children}
            </RootShell>
        </RecentsProvider>
    )
}

export function AppShell({ children }: { children: React.ReactNode }) {
    return <AppShellInner>{children}</AppShellInner>
}
