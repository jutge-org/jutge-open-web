'use client'

import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

/**
 * Body height shared by every home widget card, so the band always lines up regardless of how
 * many rows each card has. Rows scroll inside it rather than changing the card's height.
 */
export const HOME_WIDGET_BODY_REM = 8

type HomeWidgetCardProps = {
    title: string
    icon: ReactNode
    /** Top border accent, e.g. 'border-t-blue-500'. */
    accentClassName: string
    /** When given, the whole header is a link to this route. */
    href?: string
    /** Trailing control, for cards whose header is not a link. Ignored when href is set. */
    action?: ReactNode
    children: ReactNode
}

export function HomeWidgetCard({ title, icon, accentClassName, href, action, children }: HomeWidgetCardProps) {
    const heading = (
        <>
            <h2 className="flex min-w-0 items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground">
                {icon}
                <span className="truncate">{title}</span>
            </h2>
            {href ? (
                <ArrowRightIcon
                    className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
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
                'flex flex-col overflow-hidden rounded-xl border border-border border-t-2 bg-card shadow-sm',
                accentClassName,
            )}
        >
            {href ? (
                <Link
                    href={href}
                    className="group flex items-center justify-between gap-2 px-3 py-2 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                    {heading}
                </Link>
            ) : (
                <div className="flex items-center justify-between gap-2 px-3 py-2">{heading}</div>
            )}

            <div
                className="overflow-y-auto overscroll-contain border-t border-border/60"
                style={{ height: `${HOME_WIDGET_BODY_REM}rem` }}
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
