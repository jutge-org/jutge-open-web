import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

// The left-1/2 -ml-[50vw] w-screen trick centers the element and stretches it to the full viewport width, regardless of any ancestor's max-width.

export function FullWidthBreakout({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen bg-background', className)}>
            {children}
        </div>
    )
}
