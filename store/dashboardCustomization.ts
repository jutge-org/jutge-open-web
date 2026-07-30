import { create } from 'zustand'

/**
 * Whether the home dashboard is in customize (edit) mode. Global so entry points outside the
 * dashboard (the settings dialog) can enable it and then navigate to the home page.
 */
type DashboardCustomizationStore = {
    editing: boolean
    startEditing: () => void
    stopEditing: () => void
}

export const useDashboardCustomizationStore = create<DashboardCustomizationStore>((set) => ({
    editing: false,
    startEditing: () => set({ editing: true }),
    stopEditing: () => set({ editing: false }),
}))
