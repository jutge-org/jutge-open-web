import { ExternalLink } from '@/components/ExternalLink'
import { DocumentationPageShell } from '@/components/documentation/DocumentationPageShell'

const referenceGroups = [
    {
        title: 'C++',
        links: [
            { label: 'cppreference (March 2018)', href: 'https://jutge.org/doc/cppreference/en/' },
            { label: 'cplusplus.com (February 2018)', href: 'https://jutge.org/doc/cplusplus.com/reference' },
        ],
    },
    {
        title: 'Python',
        links: [
            { label: 'Python Reference (3.11.2)', href: 'https://jutge.org/doc/python-reference' },
            { label: 'Python Cheat Sheet', href: 'https://jutge.org/doc/python-cheat-sheet.pdf' },
        ],
    },
    {
        title: 'Java',
        links: [
            {
                label: 'Java Platform, Standard Edition & Java Development Kit Version 9 API Specification',
                href: 'https://jutge.org/doc/java/docs',
            },
        ],
    },
    {
        title: 'C',
        links: [
            {
                label: 'C Reference from cppreference (March 2018)',
                href: 'https://jutge.org/doc/cppreference/en/c.html',
            },
            { label: 'C Reference Card', href: 'https://jutge.org/doc/c-refcard.pdf' },
        ],
    },
    {
        title: 'Haskell',
        links: [
            { label: 'Basic Haskell Cheat Sheet', href: 'https://jutge.org/doc/basic-haskell-cheat-sheet.pdf' },
            { label: 'Haskell Cheat Sheet', href: 'https://jutge.org/doc/haskell-cheat-sheet.pdf' },
        ],
    },
]

export default function DocumentationReferencesPage() {
    return (
        <DocumentationPageShell
            activeTab="references"
            breadcrumbs={[
                { title: 'Documentation', url: '/documentation' },
                { title: 'References', url: '/documentation/references' },
            ]}
        >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <ul className="divide-y divide-border">
                    {referenceGroups.map((group) => (
                        <li key={group.title}>
                            <div className="bg-muted/40 px-6 py-3 text-sm font-semibold text-foreground">
                                {group.title}
                            </div>
                            <ul className="divide-y divide-border">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <ExternalLink
                                            href={link.href}
                                            className="block px-6 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                                        >
                                            {link.label}
                                        </ExternalLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </DocumentationPageShell>
    )
}
