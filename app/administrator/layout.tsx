'use client'

import type { ReactNode } from 'react'

import { ColorTheme } from '@/components/ColorTheme'

export default function AdministratorLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <ColorTheme theme="administrator" />
            {children}
        </>
    )
}
