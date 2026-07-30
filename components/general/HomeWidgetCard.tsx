'use client'

import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Spinner } from '@/components/ui/spinner'
import type { DashboardCardSize } from '@/lib/dashboardModules'
import { cn } from '@/lib/utils'

/**
 * Shared shell for the home dashboard widget cards. The body has a fixed height per size (extra
 * rows scroll inside rather than stretching the card) but still grows to keep cards sharing a
 * grid row flush when a neighbour is taller.
 */

type HomeWidgetCardProps = {
    title: string
    /** Smaller muted line under the title, e.g. the source of the content. */
    subtitle?: string
    /** Body height: small (default) or large (double the small height). */
    size?: DashboardCardSize
    icon: ReactNode
    /** Top border accent, e.g. 'border-t-blue-500'. */
    accentClassName: string
    /** When given, the whole header is a link to this route. */
    href?: string
    /** Trailing control, for cards whose header is not a link. Ignored when href is set. */
    action?: ReactNode
    children: ReactNode
}

export function HomeWidgetCard({
    title,
    subtitle,
    size = 'small',
    icon,
    accentClassName,
    href,
    action,
    children,
}: HomeWidgetCardProps) {
    const heading = (
        <>
            <div className="min-w-0 flex-1">
                <h2 className="flex min-h-7 min-w-0 items-center gap-2 font-heading text-base font-semibold leading-snug text-foreground">
                    {icon}
                    <span className="truncate">{title}</span>
                </h2>
                {subtitle ? (
                    <p className="-mt-0.5 truncate pb-1 pl-6 text-xs text-muted-foreground">{subtitle}</p>
                ) : null}
            </div>
            {href ? (
                <ArrowRightIcon
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                />
            ) : (
                action
            )}
        </>
    )

    return (
        <section
            aria-label={title}
            className={cn(
                'flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border border-t-2 bg-card shadow-sm',
                accentClassName,
            )}
        >
            {href ? (
                <Link
                    href={href}
                    className="group flex shrink-0 items-center justify-between gap-2 px-4 py-2 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                    {heading}
                </Link>
            ) : (
                <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-2">{heading}</div>
            )}

            <div
                className={cn(
                    'shrink-0 grow overflow-y-auto overscroll-contain border-t border-border/60',
                    size === 'large' ? 'h-64' : 'h-32',
                )}
            >
                {children}
            </div>
        </section>
    )
}

/** Centred message filling the card body, for empty states. */
export function HomeWidgetMessage({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-full items-center justify-center px-3">
            <p className="text-center text-xs text-muted-foreground">{children}</p>
        </div>
    )
}

/** Centred spinner filling the card body, for loading states. */
export function HomeWidgetLoading({ label }: { label: string }) {
    return (
        <div aria-busy="true" aria-label={label} className="flex h-full items-center justify-center">
            <Spinner className="size-5 text-muted-foreground" />
        </div>
    )
}
