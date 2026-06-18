import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type ProseProps = {
    children: ReactNode
    className?: string
}

export function Prose({ children, className }: ProseProps) {
    return (
        <div
            className={cn(
                'prose prose-neutral dark:prose-invert max-w-none text-muted-foreground',
                'prose-headings:text-foreground prose-strong:text-foreground',
                'prose-a:font-medium prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary',
                'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none',
                'prose-pre:bg-muted prose-pre:text-foreground',
                className,
            )}
        >
            {children}
        </div>
    )
}
