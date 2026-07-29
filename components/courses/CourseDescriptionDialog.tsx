'use client'

import { InfoIcon, SignatureIcon } from 'lucide-react'
import { useState } from 'react'

import { MarkdownText } from '@/components/general/MarkdownText'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type CourseDescriptionDialogProps = {
    title: string
    ownerName: string
    description: string
}

export function CourseDescriptionDialog({ title, ownerName, description }: CourseDescriptionDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-6 shrink-0 text-muted-foreground"
                                aria-label="Course description"
                            >
                                <InfoIcon className="size-3.5" aria-hidden />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">Course description</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                        <SignatureIcon className="size-3.5 shrink-0" aria-hidden />
                        <span className="min-w-0">{ownerName}</span>
                    </p>
                    <div className="flex min-w-0 items-start gap-1.5">
                        <InfoIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        <MarkdownText>{description}</MarkdownText>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
