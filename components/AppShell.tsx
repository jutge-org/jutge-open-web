'use client'

import { AuthProvider, useAuth } from '@/components/AuthProvider'
import { AuthToolbar } from '@/components/AuthToolbar'
import { ReportIssueButton } from '@/components/ReportIssueButton'
import { CommandPalette } from '@/components/CommandPalette'
import { AppearanceSettingsDialog } from '@/components/AppearanceSettingsDialog'
import { RecentMenu } from '@/components/RecentMenu'
import { RecentsProvider } from '@/components/RecentsProvider'
import { AppFooter } from '@/components/layout/AppFooter'
import { LayoutWidthContainer } from '@/components/layout/LayoutWidthContainer'
import { RootShell } from '@/components/RootShell'
import { MainBreadcrumbsInLayout } from '@/app/MainBreadcrumbsInLayout'

function AppShellInner({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const authenticated = user !== null

    return (
        <RecentsProvider>
            <RootShell
                header={
                    <header className="sticky top-0 z-50 border-b border-border bg-background">
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
    return (
        <AuthProvider>
            <AppShellInner>{children}</AppShellInner>
        </AuthProvider>
    )
}
