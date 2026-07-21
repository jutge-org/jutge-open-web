'use client'

import { AppearanceSettings } from '@/components/appearance/AppearanceSettings'
import { APPEARANCE_SETTINGS_OPEN_EVENT } from '@/lib/appearanceSettings'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Global, event-driven Appearance settings dialog. It has no visible trigger of
 * its own — it opens in response to {@link APPEARANCE_SETTINGS_OPEN_EVENT} (fired
 * from the command palette). The canonical home for these settings is the
 * `/profile/settings` tab; this dialog is the quick-access overlay that also
 * keeps the panel reachable for signed-out visitors.
 */
export function AppearanceSettingsDialog() {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {mounted ? (
                <DialogContent className="flex max-h-[75vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0">
                    <DialogHeader className="shrink-0 px-6 pt-6">
                        <DialogTitle>Appearance</DialogTitle>
                        <DialogDescription>
                            Customize the appearance of Jutge.org to your needs and liking.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto px-6 py-6">
                        <AppearanceSettings />
                    </div>
                    <div className="shrink-0 border-t border-border px-6 py-4">
                        <Button type="button" className="w-full" onClick={() => setOpen(false)}>
                            <XIcon className="size-4" aria-hidden />
                            Close
                        </Button>
                    </div>
                </DialogContent>
            ) : null}
        </Dialog>
    )
}
