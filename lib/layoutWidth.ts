export const LAYOUT_WIDTH_STORAGE_KEY = 'jutge-layout-width'

export const LAYOUT_WIDTH_CONSTRAINED = 'constrained' as const
export const LAYOUT_WIDTH_WIDE = 'wide' as const
export const LAYOUT_WIDTH_FULL = 'full' as const

export const LAYOUT_WIDTH_OPTIONS = [
    LAYOUT_WIDTH_CONSTRAINED,
    LAYOUT_WIDTH_WIDE,
    LAYOUT_WIDTH_FULL,
] as const

export type LayoutWidth = (typeof LAYOUT_WIDTH_OPTIONS)[number]

export const DEFAULT_LAYOUT_WIDTH: LayoutWidth = LAYOUT_WIDTH_CONSTRAINED

export function parseLayoutWidth(value: string | null): LayoutWidth | null {
    if ((LAYOUT_WIDTH_OPTIONS as readonly string[]).includes(value ?? '')) {
        return value as LayoutWidth
    }

    return null
}

export function layoutWidthMaxWidthClass(layoutWidth: LayoutWidth): string | undefined {
    switch (layoutWidth) {
        case LAYOUT_WIDTH_CONSTRAINED:
            return 'max-w-5xl'
        case LAYOUT_WIDTH_WIDE:
            return 'max-w-7xl'
        case LAYOUT_WIDTH_FULL:
            return undefined
    }
}

export function layoutWidthBootstrapScript(): string {
    const validValues = LAYOUT_WIDTH_OPTIONS.map((value) => `'${value}'`).join(',')
    return `(function(){try{var w=localStorage.getItem('${LAYOUT_WIDTH_STORAGE_KEY}');if([${validValues}].includes(w))document.documentElement.dataset.layoutWidth=w}catch(e){}})();`
}
