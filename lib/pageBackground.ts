export const DEFAULT_PAGE_BACKGROUND = 0
export const MIN_PAGE_BACKGROUND = 0
export const MAX_PAGE_BACKGROUND = 16

export type PageBackgroundPreference = number

export function parsePageBackground(value: unknown): PageBackgroundPreference | null {
    const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
    if (!Number.isInteger(parsed) || parsed < MIN_PAGE_BACKGROUND || parsed > MAX_PAGE_BACKGROUND) {
        return null
    }

    return parsed
}

export function pageBackgroundImageUrl(background: PageBackgroundPreference): string {
    return `https://picsum.photos/seed/${background}/800/600`
}

export function syncPageBackground(background: PageBackgroundPreference): void {
    if (typeof document === 'undefined') {
        return
    }

    const root = document.documentElement
    if (background <= 0) {
        delete root.dataset.pageBackground
        root.style.removeProperty('--page-background-image')
        return
    }

    root.dataset.pageBackground = String(background)
    root.style.setProperty('--page-background-image', `url(${pageBackgroundImageUrl(background)})`)
}
