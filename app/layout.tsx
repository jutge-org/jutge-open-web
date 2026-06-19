import { AuthToolbar } from '@/components/AuthToolbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AppToaster } from '@/components/AppToaster'
import { getCurrentClient, isAuthenticated, tryGetCurrentUser } from '@/lib/auth'
import type { CoursesNavItem } from '@/lib/courses'
import { fetchEnrolledCoursesNavItems } from '@/services/queries/courses'
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
    const currentYear = new Date().getFullYear()

    return (
        <html lang="en" className="bg-background" suppressHydrationWarning>
            <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
                <ThemeProvider>
                    <header className="sticky top-0 z-50 border-b border-border bg-background">
                        <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                            <MainBreadcrumbsInLayout
                                authenticated={authenticated}
                                instructor={currentUser?.instructor ?? false}
                                administrator={currentUser?.administrator ?? false}
                                enrolledCoursesNavItems={enrolledCoursesNavItems}
                            />
                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                <AuthToolbar
                                    authenticated={authenticated}
                                    instructor={currentUser?.instructor ?? false}
                                    administrator={currentUser?.administrator ?? false}
                                    userName={currentUser?.name}
                                />
                            </div>
                        </div>
                    </header>

                    <main className="mx-auto w-full max-w-6xl flex-1px-4 pt-4 pb-2 sm:px-6">{children}</main>

                    <footer className="mt-auto border-t border-border bg-background">
                        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p>© Universitat Politècnica de Catalunya — BarcelonaTech, {currentYear}</p>
                        </div>
                    </footer>
                    <AppToaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
