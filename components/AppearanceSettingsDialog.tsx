'use client'

import {
    AppearanceSettings,
    SETTINGS_CATEGORIES,
    settingsSectionDomId,
    type SettingsCategoryId,
} from '@/components/appearance/AppearanceSettings'
import { useAuth } from '@/components/AuthProvider'
import { APPEARANCE_SETTINGS_OPEN_EVENT } from '@/lib/appearanceSettings'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Global, event-driven Settings dialog. It has no visible trigger of its own — it opens in
 * response to {@link APPEARANCE_SETTINGS_OPEN_EVENT} (fired from the header button, the account
 * menu, and the command palette), and stays reachable for signed-out visitors.
 *
 * Settings render as a single scrolling list on phones; on desktop a left category column jumps
 * straight to the matching part of the list.
 */
export function AppearanceSettingsDialog() {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [activeCategory, setActiveCategory] = useState<SettingsCategoryId>('theme')
    const { user } = useAuth()
    const authenticated = user !== null

    const categories = SETTINGS_CATEGORIES.filter((category) => !category.requiresAuth || authenticated)

    useEffect(() => {
        queueMicrotask(() => setMounted(true))
    }, [])

    useEffect(() => {
        function onOpenRequest() {
            setOpen(true)
        }

        window.addEventListener(APPEARANCE_SETTINGS_OPEN_EVENT, onOpenRequest)
        return () => window.removeEventListener(APPEARANCE_SETTINGS_OPEN_EVENT, onOpenRequest)
    }, [])

    function handleOpenChange(next: boolean) {
        setOpen(next)
        if (!next) {
            setActiveCategory('theme')
        }
    }

    function jumpToCategory(id: SettingsCategoryId) {
        setActiveCategory(id)
        document.getElementById(settingsSectionDomId(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {mounted ? (
                <DialogContent className="flex max-h-[80vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0 md:max-w-3xl">
                    <DialogHeader className="shrink-0 border-b border-border px-6 pb-4 pt-6">
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>Customize Jutge.org to your needs and liking.</DialogDescription>
                    </DialogHeader>
                    <div className="flex min-h-0 flex-1">
                        <nav
                            aria-label="Settings sections"
                            className="hidden w-48 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border p-3 md:flex"
                        >
                            {categories.map((category) => {
                                const CategoryIcon = category.icon
                                return (
                                    <Button
                                        key={category.id}
                                        type="button"
                                        variant={category.id === activeCategory ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="justify-start gap-2"
                                        aria-current={category.id === activeCategory ? 'true' : undefined}
                                        onClick={() => jumpToCategory(category.id)}
                                    >
                                        <CategoryIcon className="size-4" aria-hidden />
                                        {category.label}
                                    </Button>
                                )
                            })}
                        </nav>
                        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                            <AppearanceSettings onNavigateAway={() => setOpen(false)} />
                        </div>
                    </div>
                    <div className="flex shrink-0 justify-end border-t border-border px-6 py-4">
                        <Button type="button" className="w-full md:w-auto" onClick={() => handleOpenChange(false)}>
                            <XIcon className="size-4" aria-hidden />
                            Close
                        </Button>
                    </div>
                </DialogContent>
            ) : null}
        </Dialog>
    )
}
