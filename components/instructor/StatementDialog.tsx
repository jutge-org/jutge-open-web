'use client'

import { XIcon } from 'lucide-react'
import { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function StatementDialog({
    isOpen,
    setIsOpen,
    problem_id,
    content,
}: {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    problem_id: string
    content: JSX.Element | string | null
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-xl lg:max-w-3xl">
                <DialogDescription className="hidden">Statement for {problem_id}</DialogDescription>
                <DialogHeader>
                    <DialogTitle>Statement for {problem_id}</DialogTitle>
                    <DialogDescription className="flex flex-col gap-4">
                        {content}
                        <Button onClick={() => setIsOpen(false)}>
                            <XIcon />
                            Close
                        </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
