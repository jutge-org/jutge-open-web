export type SiteNavLink = {
    href: string
    label: string
    match: (pathname: string) => boolean
}

export const homeLink: SiteNavLink = {
    href: '/',
    label: 'Home',
    match: (pathname) => pathname === '/',
}

const problemsLink: SiteNavLink = {
    href: '/problems',
    label: 'Problems',
    match: (pathname) => pathname === '/problems' || pathname.startsWith('/problems/'),
}

const submissionsLink: SiteNavLink = {
    href: '/submissions',
    label: 'Submissions',
    match: (pathname) => pathname === '/submissions' || pathname.startsWith('/submissions/'),
}

const examsLink: SiteNavLink = {
    href: '/exams',
    label: 'Exams',
    match: (pathname) => pathname === '/exams' || pathname.startsWith('/exams/'),
}

const coursesLink: SiteNavLink = {
    href: '/courses',
    label: 'Courses',
    match: (pathname) => pathname === '/courses' || pathname.startsWith('/courses/'),
}

const activityLink: SiteNavLink = {
    href: '/activity',
    label: 'Activity',
    match: (pathname) => pathname === '/activity',
}

const awardsLink: SiteNavLink = {
    href: '/awards',
    label: 'Awards',
    match: (pathname) => pathname === '/awards' || pathname.startsWith('/awards/'),
}

const profileLink: SiteNavLink = {
    href: '/profile',
    label: 'Profile',
    match: (pathname) => pathname === '/profile' || pathname.startsWith('/profile/'),
}

const instructorLink: SiteNavLink = {
    href: '/instructor',
    label: 'Instructor',
    match: (pathname) => pathname === '/instructor' || pathname.startsWith('/instructor/'),
}

const administratorLink: SiteNavLink = {
    href: '/administrator',
    label: 'Administrator',
    match: (pathname) => pathname === '/administrator' || pathname.startsWith('/administrator/'),
}

const documentationLink: SiteNavLink = {
    href: '/documentation',
    label: 'Documentation',
    match: (pathname) => pathname === '/documentation' || pathname.startsWith('/documentation/'),
}

const aboutLink: SiteNavLink = {
    href: '/about',
    label: 'About',
    match: (pathname) => pathname === '/about' || pathname.startsWith('/about/'),
}

/** Compare hrefs loosely (trailing slashes) for matching menu anchors to crumbs. */
export function pathsHrefEqual(a: string, b: string): boolean {
    const norm = (p: string) => {
        if (p === '/') return '/'
        const t = p.replace(/\/+$/, '')
        return t === '' ? '/' : t
    }
    return norm(a) === norm(b)
}

const links: readonly SiteNavLink[] = [coursesLink, problemsLink, documentationLink, aboutLink]

const authenticatedLinks: readonly SiteNavLink[] = [
    coursesLink,
    problemsLink,
    submissionsLink,
    examsLink,
    activityLink,
    awardsLink,
    profileLink,
    documentationLink,
    aboutLink,
]

export type SiteNavLinksContext = {
    authenticated: boolean
    instructor?: boolean
    administrator?: boolean
}

export const authenticatedNavLinkDescriptions: Record<string, string> = {
    '/': 'Return to the home page',
    '/problems': 'Browse and solve programming problems',
    '/submissions': 'Track your submissions and verdicts',
    '/exams': 'View past and upcoming exams',
    '/courses': 'Browse your courses and assignments',
    '/activity': 'Check your activity and progress',
    '/awards': 'Badges and achievements you have earned',
    '/profile': 'See and update your Jutge.org profile',
    '/instructor': 'Manage courses, exams, and teaching tools',
    '/administrator': 'Site administration and configuration',
    '/documentation': 'Learn how to use Jutge.org',
    '/about': 'What is this site and who made it?',
}

export const guestNavLinkDescriptions: Record<string, string> = {
    '/': 'Return to the home page',
    '/problems': 'Browse public programming problems',
    '/courses': 'Browse public courses',
    '/documentation': 'Documentation for Jutge.org',
    '/about': 'Find more about this site',
}

export function getSiteNavLinkDescription(href: string, context: SiteNavLinksContext): string {
    const descriptions = context.authenticated ? authenticatedNavLinkDescriptions : guestNavLinkDescriptions
    return descriptions[href] ?? ''
}

export function getSiteNavLinks(context: SiteNavLinksContext): readonly SiteNavLink[] {
    if (!context.authenticated) return links

    const roleLinks: SiteNavLink[] = []
    if (context.instructor) roleLinks.push(instructorLink)
    if (context.administrator) roleLinks.push(administratorLink)

    const profileIndex = authenticatedLinks.indexOf(profileLink)
    return [
        ...authenticatedLinks.slice(0, profileIndex + 1),
        ...roleLinks,
        ...authenticatedLinks.slice(profileIndex + 1),
    ]
}
