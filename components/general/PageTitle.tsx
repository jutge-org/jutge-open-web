import { PageTitleGuestDescription } from '@/components/general/PageTitleGuestDescription'
import { cn } from '@/lib/utils'
import {
    Award,
    BookOpen,
    BookText,
    ActivityIcon,
    SendIcon,
    CrownIcon,
    EyeIcon,
    GraduationCap,
    Info,
    FileBracesCornerIcon,
    KeyRoundIcon,
    SchoolIcon,
    User,
    UserPlusIcon,
} from 'lucide-react'

export type PageTitleSection =
    | '/problems'
    | '/submissions'
    | '/exams'
    | '/courses'
    | '/activity'
    | '/awards'
    | '/profile'
    | '/supervision'
    | '/registration'
    | '/password-reset'
    | '/instructor'
    | '/administrator'
    | '/documentation'
    | '/about'

const cardAccent: Record<PageTitleSection, string> = {
    '/problems': 'border-l-4 border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
    '/submissions': 'border-l-4 border-l-blue-500 text-blue-600 dark:text-blue-400',
    '/exams': 'border-l-4 border-l-orange-500 text-orange-600 dark:text-orange-400',
    '/courses': 'border-l-4 border-l-cyan-500 text-cyan-600 dark:text-cyan-400',
    '/activity': 'border-l-4 border-l-sky-500 text-sky-600 dark:text-sky-400',
    '/awards': 'border-l-4 border-l-yellow-500 text-yellow-600 dark:text-yellow-400',
    '/profile': 'border-l-4 border-l-amber-500 text-amber-600 dark:text-amber-400',
    '/supervision': 'border-l-4 border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
    '/registration': 'border-l-4 border-l-indigo-500 text-indigo-600 dark:text-indigo-400',
    '/password-reset': 'border-l-4 border-l-violet-500 text-violet-600 dark:text-violet-400',
    '/instructor': 'border-l-4 border-l-orange-500 text-orange-600 dark:text-orange-400',
    '/administrator': 'border-l-4 border-l-purple-500 text-purple-600 dark:text-purple-400',
    '/documentation': 'border-l-4 border-l-amber-600 text-amber-600 dark:text-amber-400',
    '/about': 'border-l-4 border-l-violet-500 text-violet-600 dark:text-violet-400',
}

const sectionLabel: Record<PageTitleSection, string> = {
    '/problems': 'Problems',
    '/submissions': 'Submissions',
    '/exams': 'Exams',
    '/courses': 'Courses',
    '/activity': 'Activity',
    '/awards': 'Awards',
    '/profile': 'Profile',
    '/supervision': 'Supervision',
    '/registration': 'Registration',
    '/password-reset': 'Password reset',
    '/instructor': 'Instructor',
    '/administrator': 'Administrator',
    '/documentation': 'Documentation',
    '/about': 'About',
}

const guestDescription: Record<PageTitleSection, string> = {
    '/problems': 'Browse public programming problems. Sign in to solve them and find more.',
    '/submissions': 'Track your submissions and verdicts',
    '/exams': 'View and take exams',
    '/courses': 'Browse public courses. Sign in to enroll in a course and find more.',
    '/activity': 'Your activity and progress',
    '/awards': 'Achievements earned',
    '/profile': 'Your account details',
    '/supervision': 'Supervise a student in the course you teach',
    '/registration': 'Create a new Jutge.org account.',
    '/password-reset': 'Reset your Jutge.org account password.',
    '/instructor': 'Manage courses, exams, and teaching tools',
    '/administrator': 'Site administration and configuration',
    '/documentation': 'Learn how to use this site',
    '/about': 'What is this site and who made it?',
}

const authenticatedDescription: Record<PageTitleSection, string> = {
    '/problems': 'Browse and solve programming problems',
    '/submissions': 'Track your submissions and verdicts',
    '/exams': 'View and take exams',
    '/courses': 'Browse your courses and assignments',
    '/activity': 'Your activity, verdicts, and progress over time',
    '/awards': 'Badges and achievements you have earned',
    '/profile': 'Your account details',
    '/supervision': 'Supervise a student in a course you teach',
    '/registration': 'Create a new Jutge.org account.',
    '/password-reset': 'Reset your Jutge.org account password.',
    '/instructor': 'Manage courses, exams, and teaching tools',
    '/administrator': 'Site administration and configuration',
    '/documentation': 'Learn how to use this site',
    '/about': 'What is this site and who made it?',
}

type PageTitleProps = {
    section: PageTitleSection
    authenticated: boolean
    description?: string
    hidden?: boolean
}

function SectionIcon({ section }: { section: PageTitleSection }) {
    const iconClass = 'size-7 shrink-0'
    switch (section) {
        case '/problems':
            return <FileBracesCornerIcon className={iconClass} aria-hidden />
        case '/submissions':
            return <SendIcon className={iconClass} aria-hidden />
        case '/exams':
            return <SchoolIcon className={iconClass} aria-hidden />
        case '/courses':
            return <BookOpen className={iconClass} aria-hidden />
        case '/activity':
            return <ActivityIcon className={iconClass} aria-hidden />
        case '/awards':
            return <Award className={iconClass} aria-hidden />
        case '/profile':
            return <User className={iconClass} aria-hidden />
        case '/supervision':
            return <EyeIcon className={iconClass} aria-hidden />
        case '/registration':
            return <UserPlusIcon className={iconClass} aria-hidden />
        case '/password-reset':
            return <KeyRoundIcon className={iconClass} aria-hidden />
        case '/instructor':
            return <GraduationCap className={iconClass} aria-hidden />
        case '/administrator':
            return <CrownIcon className={iconClass} aria-hidden />
        case '/documentation':
            return <BookText className={iconClass} aria-hidden />
        case '/about':
            return <Info className={iconClass} aria-hidden />
    }
}

const doDotShowTitle = true

export function PageTitle({
    section,
    authenticated,
    description: descriptionOverride,
    hidden = doDotShowTitle,
}: PageTitleProps) {
    const title = sectionLabel[section]
    const description =
        descriptionOverride ?? (authenticated ? authenticatedDescription[section] : guestDescription[section])

    if (hidden) return null

    return (
        <div className="flex min-h-22 items-center gap-5 rounded-2xl border border-border bg-card px-6 py-5 text-left shadow-sm">
            <span
                className={cn(
                    'flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted/80',
                    cardAccent[section],
                )}
            >
                <SectionIcon section={section} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
                <p className="text-sm font-normal leading-snug text-muted-foreground">
                    {!authenticated ? (
                        <PageTitleGuestDescription section={section} fallback={description} />
                    ) : (
                        description
                    )}
                </p>
            </span>
        </div>
    )
}
