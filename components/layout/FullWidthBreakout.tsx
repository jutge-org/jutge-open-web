import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type FullWidthBreakoutProps = {
    children: ReactNode
    className?: string
}

export function FullWidthBreakout({ children, className }: FullWidthBreakoutProps) {
    return (
        <div className={cn('bg-background', className)}>
            <div className="sm:px-2">{children}</div>
        </div>
    )
}
