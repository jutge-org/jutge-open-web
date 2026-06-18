'use client'

import { BanIcon, CircleCheckBigIcon } from 'lucide-react'
import { JSX, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export type ConfirmDialogConfig = {
    title: string
    acceptIcon?: React.ReactNode
    acceptLabel?: string
    cancelIcon?: React.ReactNode
    cancelLabel?: string
}

export type ConfirmDialogResult = boolean

export const useConfirmDialog = (
    config: ConfirmDialogConfig,
): [(message: string) => Promise<ConfirmDialogResult>, () => JSX.Element] => {
    const [promise, setPromise] = useState<{
        resolve: (result: ConfirmDialogResult) => void
    } | null>(null)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')

    function runConfirmDialog(message: string): Promise<ConfirmDialogResult> {
        setMessage(message)
        setOpen(true)
        return new Promise((resolve) => {
            setPromise({ resolve })
        })
    }

    function ConfirmDialogComponent() {
        function close() {
            promise?.resolve(false)
            setOpen(false)
        }

        function acceptAction() {
            promise?.resolve(true)
            close()
        }

        function cancelAction() {
            promise?.resolve(false)
            close()
        }

        const cancelIcon = config.cancelIcon || <BanIcon />
        const acceptIcon = config.acceptIcon || <CircleCheckBigIcon />

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onCloseAutoFocus={cancelAction}>
                    <DialogHeader>
                        <DialogTitle>{config.title}</DialogTitle>
                        <DialogDescription>{message}</DialogDescription>
                    </DialogHeader>
                    <div className="flex w-full flex-row gap-2 pt-4">
                        <Button className="w-full" variant="outline" onClick={cancelAction}>
                            {cancelIcon}
                            {config.cancelLabel || 'Cancel'}
                        </Button>
                        <Button className="w-full" onClick={acceptAction}>
                            {acceptIcon}
                            {config.acceptLabel || 'Accept'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return [runConfirmDialog, ConfirmDialogComponent]
}
