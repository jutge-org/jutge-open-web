import type { Compiler } from '@/lib/jutge_api_client'

export type DocumentationTab =
    | 'index'
    | 'faq'
    | 'compilers'
    | 'verdicts'
    | 'code-metrics'
    | 'pylibs'
    | 'certificates'
    | 'markdown'
    | 'references'

export type DocumentationNavItem = {
    tab: DocumentationTab
    label: string
    href: string
    external?: boolean
}

export const documentationNavItems: DocumentationNavItem[] = [
    { tab: 'index', label: 'Index', href: '/documentation' },
    { tab: 'faq', label: 'FAQ', href: '/documentation/faq' },
    { tab: 'compilers', label: 'Compilers', href: '/documentation/compilers' },
    { tab: 'verdicts', label: 'Verdicts', href: '/documentation/verdicts' },
    { tab: 'code-metrics', label: 'Code metrics', href: '/documentation/code-metrics' },
    { tab: 'pylibs', label: 'Python libs', href: '/documentation/pylibs' },
    { tab: 'certificates', label: 'Certificates', href: '/documentation/certificates' },
    { tab: 'markdown', label: 'Markdown', href: '/documentation/markdown' },
    { tab: 'references', label: 'References', href: '/documentation/references' },
]

export const documentationIndexItems = [
    {
        href: '/documentation/faq',
        label: 'FAQ',
        description: 'Common questions about problems, solutions, and verdicts',
    },
    {
        href: '/documentation/compilers',
        label: 'Compilers',
        description: 'Languages and compilers available on Jutge.org',
    },
    {
        href: '/documentation/verdicts',
        label: 'Verdicts',
        description: 'What each submission verdict means',
    },
    {
        href: '/documentation/code-metrics',
        label: 'Code metrics',
        description: 'Static code quality measures for submissions',
    },
    {
        href: 'https://github.com/jutge-org/jutge-toolkit',
        label: 'Toolkit',
        description: 'Official Jutge toolkit on GitHub',
        external: true,
    },
    {
        href: 'https://api.jutge.org',
        label: 'API',
        description: 'Jutge.org API documentation',
        external: true,
    },
    {
        href: '/documentation/pylibs',
        label: 'Python libs',
        description: 'Non-standard Python libraries available on Jutge.org',
    },
    {
        href: '/documentation/certificates',
        label: 'Certificates',
        description: 'Signed certificates for corrected submissions',
    },
    {
        href: '/documentation/markdown',
        label: 'Markdown',
        description: 'Markdown syntax guide for Jutge.org',
    },
    {
        href: '/documentation/references',
        label: 'References',
        description: 'Language references and cheat sheets',
    },
    {
        href: 'https://github.com/jutge-org/',
        label: 'GitHub repos',
        description: 'Jutge organization repositories',
        external: true,
    },
] as const

export function compilerIdToSlug(compilerId: string): string {
    return compilerId.replace(/\+\+/g, 'XX')
}

export function slugToCompilerId(slug: string): string {
    return slug.replace(/XX/g, '++')
}

export function getCompilerStatus(compiler: Compiler): { icon: string; label: string; defunct: boolean } {
    if (compiler.status === 'Defunct') {
        return { icon: '💀', label: 'Defunct', defunct: true }
    }
    if (compiler.status) {
        return { icon: '🔴', label: compiler.status, defunct: false }
    }
    return { icon: '🟢', label: 'Ok', defunct: false }
}

export function findCompilerBySlug(compilers: Compiler[], slug: string): Compiler | undefined {
    const compilerId = slugToCompilerId(slug)
    return compilers.find((c) => c.compiler_id === compilerId)
}
