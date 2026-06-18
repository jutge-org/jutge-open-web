import { create } from 'zustand'

/** Ordered trail: each segment links to `url`; the last segment is rendered as the current page. */
export type MainBreadcrumbSegment = Readonly<{ title: string; url: string }>

export const useMainBreadcrumbs = create<{
    breadcrumbs: MainBreadcrumbSegment[]
    setBreadcrumbs: (segments: readonly MainBreadcrumbSegment[]) => void
}>((set) => ({
    breadcrumbs: [],
    setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs: [...breadcrumbs] }),
}))
