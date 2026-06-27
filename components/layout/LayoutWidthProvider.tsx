'use client'

import {
    DEFAULT_LAYOUT_WIDTH,
    LAYOUT_WIDTH_STORAGE_KEY,
    parseLayoutWidth,
    type LayoutWidth,
} from '@/lib/layoutWidth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type LayoutWidthContextValue = {
    layoutWidth: LayoutWidth
    setLayoutWidth: (layoutWidth: LayoutWidth) => void
}

const LayoutWidthContext = createContext<LayoutWidthContextValue | null>(null)

function syncLayoutWidthDataset(layoutWidth: LayoutWidth) {
    document.documentElement.dataset.layoutWidth = layoutWidth
}

function readStoredLayoutWidth(): LayoutWidth {
    if (typeof window === 'undefined') {
        return DEFAULT_LAYOUT_WIDTH
    }

    return parseLayoutWidth(localStorage.getItem(LAYOUT_WIDTH_STORAGE_KEY)) ?? DEFAULT_LAYOUT_WIDTH
}

export function LayoutWidthProvider({ children }: { children: ReactNode }) {
    const [layoutWidth, setLayoutWidthState] = useState<LayoutWidth>(readStoredLayoutWidth)

    useEffect(() => {
        syncLayoutWidthDataset(layoutWidth)
    }, [layoutWidth])

    function setLayoutWidth(next: LayoutWidth) {
        setLayoutWidthState(next)
        localStorage.setItem(LAYOUT_WIDTH_STORAGE_KEY, next)
        syncLayoutWidthDataset(next)
    }

    return (
        <LayoutWidthContext.Provider value={{ layoutWidth, setLayoutWidth }}>
            {children}
        </LayoutWidthContext.Provider>
    )
}

export function useLayoutWidth() {
    const context = useContext(LayoutWidthContext)
    if (!context) {
        throw new Error('useLayoutWidth must be used within a LayoutWidthProvider')
    }

    return context
}
