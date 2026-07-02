import { AuthToolbar } from '@/components/AuthToolbar'
import { CommandPalette } from '@/components/CommandPalette'
import { AppearanceSettingsDialog } from '@/components/AppearanceSettingsDialog'
import { RecentMenu } from '@/components/RecentMenu'
import { RecentsProvider } from '@/components/RecentsProvider'
import { AppFooter } from '@/components/layout/AppFooter'
import { LayoutWidthContainer } from '@/components/layout/LayoutWidthContainer'
import { LayoutWidthProvider } from '@/components/layout/LayoutWidthProvider'
import { AppearancePreferencesProvider } from '@/components/AppearancePreferencesProvider'
import { RootShell } from '@/components/RootShell'
import { SkipLink } from '@/components/SkipLink'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppToaster } from '@/components/AppToaster'
import { getCurrentClient, isAuthenticated, tryGetCurrentUser } from '@/lib/auth'
import type { CoursesNavItem } from '@/lib/courses'
import { fetchEnrolledCoursesNavItems } from '@/services/queries/courses'
import { layoutWidthBootstrapScript } from '@/lib/layoutWidth'
import { reducedMotionBootstrapScript } from '@/lib/reducedMotion'
import type { Metadata } from 'next'
import './globals.css'
import { MainBreadcrumbsInLayout } from './MainBreadcrumbsInLayout'

export const metadata: Metadata = {
    title: 'Jutge.org',
    description: 'The Open client for Jutge.org',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const authenticated = await isAuthenticated()
    const currentUser = authenticated ? await tryGetCurrentUser() : null
    const enrolledCoursesNavItems: CoursesNavItem[] = authenticated
        ? await fetchEnrolledCoursesNavItems(await getCurrentClient())
        : []
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
                            <RecentsProvider authenticated={authenticated} userId={currentUser?.id ?? null}>
                                <RootShell
                                    header={
                                        <header className="sticky top-0 z-50 border-b border-border bg-background">
                                            <LayoutWidthContainer className="flex h-11 items-center justify-between gap-4 px-4 sm:px-6">
                                                <MainBreadcrumbsInLayout
                                                    authenticated={authenticated}
                                                    instructor={currentUser?.instructor ?? false}
                                                    administrator={currentUser?.administrator ?? false}
                                                    enrolledCoursesNavItems={enrolledCoursesNavItems}
                                                />
                                                <div className="flex items-center gap-0">
                                                    <CommandPalette authenticated={authenticated} />
                                                    {authenticated ? <RecentMenu /> : null}
                                                    <AppearanceSettingsDialog />
                                                    <AuthToolbar
                                                        authenticated={authenticated}
                                                        instructor={currentUser?.instructor ?? false}
                                                        administrator={currentUser?.administrator ?? false}
                                                        userName={currentUser?.name}
                                                    />
                                                </div>
                                            </LayoutWidthContainer>
                                        </header>
                                    }
                                    footer={<AppFooter />}
                                >
                                    {children}
                                </RootShell>
                                <AppToaster />
                            </RecentsProvider>
                        </AppearancePreferencesProvider>
                    </LayoutWidthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
