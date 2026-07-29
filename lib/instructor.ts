export type InstructorTab =
    | 'index'
    | 'courses'
    | 'lists'
    | 'exams'
    | 'documents'
    | 'problems'
    | 'search'
    | 'jutgeai'

export type InstructorNavItem = {
    tab: InstructorTab
    label: string
    href: string
}

export const instructorNavItems: InstructorNavItem[] = [
    { tab: 'index', label: 'Index', href: '/instructor' },
    { tab: 'courses', label: 'Courses', href: '/instructor/courses' },
    { tab: 'lists', label: 'Lists', href: '/instructor/lists' },
    { tab: 'exams', label: 'Exams', href: '/instructor/exams' },
    { tab: 'documents', label: 'Documents', href: '/instructor/documents' },
    { tab: 'problems', label: 'Problems', href: '/instructor/problems' },
    { tab: 'search', label: 'Search', href: '/instructor/search' },
    { tab: 'jutgeai', label: 'JutgeAI', href: '/instructor/jutgeai' },
]

export function instructorTabFromPathname(pathname: string): InstructorTab {
    if (pathname === '/instructor' || pathname === '/instructor/') {
        return 'index'
    }

    for (const item of instructorNavItems) {
        if (item.tab === 'index') continue
        if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
            return item.tab
        }
    }

    return 'index'
}

/**
 * True when the sticky header should show the main instructor section tabs.
 * False on resource detail pages that already register their own InstructorSubNav.
 */
export function instructorShowsMainSubNav(pathname: string): boolean {
    if (pathname.startsWith('/instructor/jutgeai')) {
        return false
    }

    const resourceSections = ['courses', 'lists', 'exams', 'problems'] as const
    for (const section of resourceSections) {
        const prefix = `/instructor/${section}/`
        if (!pathname.startsWith(prefix)) continue
        const first = pathname.slice(prefix.length).split('/')[0]
        if (!first || first === 'new') continue
        return false
    }

    return true
}

export const instructorIndexItems = [
    {
        href: '/instructor/courses',
        label: 'Courses',
        description: 'Manage courses, students, tutors, and problem lists',
    },
    {
        href: '/instructor/lists',
        label: 'Lists',
        description: 'Create and edit ordered problem lists',
    },
    {
        href: '/instructor/exams',
        label: 'Exams',
        description: 'Configure exams, rosters, submissions, and rankings',
    },
    {
        href: '/instructor/documents',
        label: 'Documents',
        description: 'Upload PDF and ZIP documents for exams',
    },
    {
        href: '/instructor/problems',
        label: 'Problems',
        description: 'Author, share, and analyze your own problems',
    },
    {
        href: '/instructor/search',
        label: 'Search',
        description: 'Semantic and full-text search across problem statements',
    },
    {
        href: '/instructor/jutgeai',
        label: 'JutgeAI',
        description: 'Chat with LLMs and review usage, cost, and emissions',
    },
] as const
