import { documentationNavItems, type DocumentationTab } from '@/lib/documentation'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type DocumentationNavProps = {
    activeTab: DocumentationTab
}

export function DocumentationNav({ activeTab }: DocumentationNavProps) {
    return (
        <nav
            aria-label="Documentation sections"
            className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm"
        >
            <ul className="flex min-w-max gap-0.5 p-1.5">
                {documentationNavItems.map(({ tab, label, href }) => {
                    const active = tab === activeTab
                    return (
                        <li key={tab}>
                            <Link
                                href={href}
                                className={cn(
                                    'inline-flex rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                                aria-current={active ? 'page' : undefined}
                            >
                                {label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
