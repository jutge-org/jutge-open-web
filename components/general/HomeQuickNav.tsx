import { getSiteNavLinks, type SiteNavLinksContext } from '@/lib/siteNavLinks'
import { cn } from '@/lib/utils'
import {
    Award,
    BookOpen,
    BookText,
    ChartColumn,
    ClipboardList,
    CrownIcon,
    GraduationCap,
    Info,
    PuzzleIcon,
    SchoolIcon,
    User,
} from 'lucide-react'
import Link from 'next/link'

type HomeQuickNavProps = SiteNavLinksContext

function NavIcon({ href, className }: { href: string; className?: string }) {
    const iconClass = cn('shrink-0', 'hover:animate-pulse', className ?? 'size-10')
    switch (href) {
        case '/problems':
            return <PuzzleIcon className={iconClass} aria-hidden />
        case '/submissions':
            return <ClipboardList className={iconClass} aria-hidden />
        case '/exams':
            return <SchoolIcon className={iconClass} aria-hidden />
        case '/courses':
            return <BookOpen className={iconClass} aria-hidden />
        case '/statistics':
            return <ChartColumn className={iconClass} aria-hidden />
        case '/awards':
            return <Award className={iconClass} aria-hidden />
        case '/profile':
            return <User className={iconClass} aria-hidden />
        case '/instructor':
            return <GraduationCap className={iconClass} aria-hidden />
        case '/administrator':
            return <CrownIcon className={iconClass} aria-hidden />
        case '/documentation':
            return <BookText className={iconClass} aria-hidden />
        case '/about':
            return <Info className={iconClass} aria-hidden />
        default:
            return null
    }
}

const cardAccent: Record<string, string> = {
    '/problems': 'border-l-4 border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
    '/submissions': 'border-l-4 border-l-blue-500 text-blue-600 dark:text-blue-400',
    '/exams': 'border-l-4 border-l-orange-500 text-orange-600 dark:text-orange-400',
    '/courses': 'border-l-4 border-l-teal-500 text-teal-600 dark:text-teal-400',
    '/statistics': 'border-l-4 border-l-sky-500 text-sky-600 dark:text-sky-400',
    '/awards': 'border-l-4 border-l-yellow-500 text-yellow-600 dark:text-yellow-400',
    '/profile': 'border-l-4 border-l-amber-500 text-amber-600 dark:text-amber-400',
    '/instructor': 'border-l-4 border-l-rose-500 text-rose-600 dark:text-rose-400',
    '/administrator': 'border-l-4 border-l-slate-500 text-slate-600 dark:text-slate-400',
    '/documentation': 'border-l-4 border-l-indigo-500 text-indigo-600 dark:text-indigo-400',
    '/about': 'border-l-4 border-l-violet-500 text-violet-600 dark:text-violet-400',
}

const authenticatedLinkDescription: Record<string, string> = {
    '/problems': 'Browse and solve programming problems',
    '/submissions': 'Track your submissions and verdicts',
    '/exams': 'View and take exams',
    '/courses': 'Browse your courses and assignments',
    '/statistics': 'Charts and stats for your Jutge activity',
    '/awards': 'Badges and achievements you have earned',
    '/profile': 'See your Jutge.org profile',
    '/instructor': 'Manage courses, exams, and teaching tools',
    '/administrator': 'Site administration and configuration',
    '/documentation': 'Learn how to use Jutge.org',
    '/about': 'What is this site and who made it?',
}

const guestLinkDescription: Record<string, string> = {
    '/problems': 'Browse programming problems',
    '/courses': 'Browse public courses',
    '/documentation': 'Documentation for Jutge.org',
    '/about': 'Find more about this site',
}

export function HomeQuickNav(props: HomeQuickNavProps) {
    const links = getSiteNavLinks(props)
    const linkDescription = props.authenticated ? authenticatedLinkDescription : guestLinkDescription

    return (
        <nav aria-label="Main sections" className="grid gap-4 sm:grid-cols-2">
            {links.map(({ href, label }) => (
                <Link
                    key={href}
                    href={href}
                    className={cn(
                        'group flex min-h-22 items-center gap-5 rounded-2xl border border-border bg-card px-6 py-5 text-left shadow-sm transition-[box-shadow,transform] duration-200 ease-out',
                        'hover:-translate-y-0.5 hover:border-primary/25 hover:bg-accent/40 hover:shadow-lg',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    )}
                >
                    <span
                        className={cn(
                            'flex size-14 items-center justify-center rounded-xl bg-muted/80 transition-colors group-hover:bg-muted',
                            cardAccent[href] ?? '',
                        )}
                    >
                        <NavIcon href={href} className="size-7" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-lg font-semibold tracking-tight text-foreground">{label}</span>
                        <span className="text-sm font-normal leading-snug text-muted-foreground group-hover:text-foreground/80">
                            {linkDescription[href] ?? ''}
                        </span>
                    </span>
                </Link>
            ))}
        </nav>
    )
}
