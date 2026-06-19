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

const statisticsLink: SiteNavLink = {
    href: '/statistics',
    label: 'Statistics',
    match: (pathname) => pathname === '/statistics',
}

const awardsLink: SiteNavLink = {
    href: '/awards',
    label: 'Awards',
    match: (pathname) => pathname === '/awards' || pathname.startsWith('/awards/'),
}

const profileLink: SiteNavLink = {
    href: '/profile',
    label: 'Profile',
    match: (pathname) => pathname === '/profile',
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
    match: (pathname) => pathname === '/about',
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

const links: readonly SiteNavLink[] = [problemsLink, coursesLink, documentationLink, aboutLink]

const authenticatedLinks: readonly SiteNavLink[] = [
    problemsLink,
    submissionsLink,
    examsLink,
    coursesLink,
    statisticsLink,
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
