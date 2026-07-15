'use client'

import { DEFAULT_LAYOUT_WIDTH, type LayoutWidth } from '@/lib/layoutWidth'
import { useOpenWebLayoutWidth, useOpenWebSettingsStore } from '@/store/openWebSettings'
import { createContext, useContext, type ReactNode } from 'react'

type LayoutWidthContextValue = {
    layoutWidth: LayoutWidth
    setLayoutWidth: (layoutWidth: LayoutWidth) => void
}

const LayoutWidthContext = createContext<LayoutWidthContextValue | null>(null)

function syncLayoutWidthDataset(layoutWidth: LayoutWidth) {
    document.documentElement.dataset.layoutWidth = layoutWidth
}

export function LayoutWidthProvider({ children }: { children: ReactNode }) {
    const layoutWidth = useOpenWebLayoutWidth()
    const setLayoutWidthInStore = useOpenWebSettingsStore((state) => state.setLayoutWidth)

    function setLayoutWidth(next: LayoutWidth) {
        setLayoutWidthInStore(next)
        syncLayoutWidthDataset(next)
    }

    return <LayoutWidthContext.Provider value={{ layoutWidth, setLayoutWidth }}>{children}</LayoutWidthContext.Provider>
}

export function useLayoutWidth() {
    const context = useContext(LayoutWidthContext)
    if (!context) {
        throw new Error('useLayoutWidth must be used within a LayoutWidthProvider')
    }

    return context
}

export { DEFAULT_LAYOUT_WIDTH }
