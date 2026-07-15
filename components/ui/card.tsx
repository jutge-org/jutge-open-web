import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, size = 'default', ...props }: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
    return (
        <div
            data-slot="card"
            data-size={size}
            className={cn(
                'group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-data-[slot=card-header]:gap-0 has-data-[slot=card-header]:pt-0 has-data-[slot=card-header]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 data-[size=sm]:has-data-[slot=card-header]:gap-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
                className,
            )}
            {...props}
        />
    )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                'group/card-header @container/card-header grid min-h-11 auto-rows-min items-center gap-1 rounded-t-xl px-4 py-2 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] has-data-[slot=card-description]:items-start',
                className,
            )}
            {...props}
        />
    )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-title"
            className={cn('flex min-h-7 items-center font-heading text-base leading-none font-bold', className)}
            {...props}
        />
    )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="card-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                'col-start-2 row-start-1 row-span-1 self-center justify-self-end group-has-data-[slot=card-description]/card-header:row-span-2 group-has-data-[slot=card-description]/card-header:self-start',
                className,
            )}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-content"
            className={cn(
                'px-4 group-data-[size=sm]/card:px-3 group-has-data-[slot=card-header]/card:py-4 group-data-[size=sm]/card:group-has-data-[slot=card-header]/card:py-3',
                className,
            )}
            {...props}
        />
    )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-footer"
            className={cn(
                'flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3',
                className,
            )}
            {...props}
        />
    )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
