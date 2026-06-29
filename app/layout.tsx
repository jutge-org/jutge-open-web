import { ExternalLink } from '@/components/ExternalLink'
import { GithubIcon } from '@/components/GithubIcon'
import { JutgeLogoIcon } from '@/components/JutgeLogoIcon'
import { UpcLogoIcon } from '@/components/UpcLogoIcon'
import { AuthToolbar } from '@/components/AuthToolbar'
import { AppearanceSettingsDialog } from '@/components/AppearanceSettingsDialog'
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
import Link from 'next/link'
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
    const currentYear = new Date().getFullYear()

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
                                            <div className="flex items-center gap-4">
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
                                footer={
                                    <footer className="mt-auto border-t border-border bg-background">
                                        <LayoutWidthContainer className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3 text-sm text-muted-foreground">
                                            <span>
                                                © Universitat Politècnica de Catalunya
                                                <span className="hidden sm:inline">
                                                    {' '}
                                                    — BarcelonaTech, {currentYear}
                                                </span>
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <ExternalLink
                                                    href="https://github.com/jutge-org/jutge-open-web"
                                                    aria-label="View source on GitHub"
                                                    className="text-foreground transition-colors hover:text-primary"
                                                >
                                                    <GithubIcon className="size-6" aria-hidden />
                                                </ExternalLink>
                                                <JutgeLogoIcon className="size-6 text-foreground" aria-hidden />
                                                <UpcLogoIcon className="size-6 text-foreground" aria-hidden />
                                            </div>
                                        </LayoutWidthContainer>
                                    </footer>
                                }
                            >
                                {children}
                            </RootShell>
                            <AppToaster />
                        </AppearancePreferencesProvider>
                    </LayoutWidthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
