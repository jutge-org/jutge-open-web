'use client'

import type { ReactNode } from 'react'

import { ColorTheme } from '@/components/ColorTheme'

export default function SupervisionLayout({ children }: { children: ReactNode }) {
    return (
        <div data-color-theme="supervision" className="flex min-h-0 flex-1 flex-col">
            <ColorTheme theme="supervision" />
            {children}
        </div>
    )
}
