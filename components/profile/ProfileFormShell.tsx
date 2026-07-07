import type { ReactNode } from 'react'
import { SaveIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ProfileFormShellProps = {
    children: ReactNode
    errorMessage: string | null
    onSave: () => void
    pending: boolean
    saveDisabled?: boolean
    saveLabel: string
    pendingLabel: string
}

export function ProfileFormShell({
    children,
    errorMessage,
    onSave,
    pending,
    saveDisabled = false,
    saveLabel,
    pendingLabel,
}: ProfileFormShellProps) {
    return (
        <div className="w-full">
            <section className="rounded-xl border border-border bg-card shadow-xs">
                <dl className="px-6">{children}</dl>

                <div className="grid gap-4 border-t border-border px-6 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                    <div className="hidden sm:block" />
                    <div className="flex flex-col gap-3">
                        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
                        <Button
                            type="button"
                            onClick={onSave}
                            disabled={pending || saveDisabled}
                            className="w-full gap-2 sm:w-auto"
                        >
                            <SaveIcon className="size-4" />
                            {pending ? pendingLabel : saveLabel}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
