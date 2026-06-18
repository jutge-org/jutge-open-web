import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type ProseProps = {
    children: ReactNode
    className?: string
}

export function Prose({ children, className }: ProseProps) {
    return <div className={cn('prose dark:prose-invert max-w-none', className)}>{children}</div>
}
