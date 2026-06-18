import { aboutNavItems, type AboutTab } from '@/lib/about'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type AboutNavProps = {
    activeTab: AboutTab
}

export function AboutNav({ activeTab }: AboutNavProps) {
    return (
        <nav aria-label="About sections" className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <ul className="flex min-w-max gap-0.5 p-1.5">
                {aboutNavItems.map(({ tab, label, href, external }) => {
                    const active = tab === activeTab
                    const className = cn(
                        'inline-flex rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                        active
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )

                    if (external) {
                        return (
                            <li key={tab}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={className}
                                >
                                    {label}
                                </a>
                            </li>
                        )
                    }

                    return (
                        <li key={tab}>
                            <Link href={href} className={className} aria-current={active ? 'page' : undefined}>
                                {label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
