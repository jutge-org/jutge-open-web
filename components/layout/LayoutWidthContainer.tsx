'use client'

import { useLayoutWidth } from '@/components/layout/LayoutWidthProvider'
import { layoutWidthMaxWidthClass } from '@/lib/layoutWidth'
import { cn } from '@/lib/utils'
import type { ElementType, ReactNode } from 'react'

type LayoutWidthContainerProps = {
    children: ReactNode
    className?: string
    as?: ElementType
    id?: string
}

export function LayoutWidthContainer({ children, className, as: Component = 'div', id }: LayoutWidthContainerProps) {
    const { layoutWidth } = useLayoutWidth()

    return (
        <Component
            id={id}
            className={cn('mx-auto w-full', layoutWidthMaxWidthClass(layoutWidth), className)}
            suppressHydrationWarning
        >
            {children}
        </Component>
    )
}
