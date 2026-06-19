'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type FloatingToolbarProps = {
    children: ReactNode
    className?: string
}

export default function FloatingToolbar({ children, className }: FloatingToolbarProps) {
    return (
        <div className={cn('fixed bottom-4 right-4 z-40 w-full', className)}>
            <div className="flex h-12 w-full flex-row items-center justify-end gap-4">{children}</div>
        </div>
    )
}
