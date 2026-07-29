'use client'

import { AlertTriangleIcon, HelpCircleIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type HelpSectionProps = {
    title: string
    children: React.ReactNode
}

function HelpSection({ title, children }: HelpSectionProps) {
    return (
        <section className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
        </section>
    )
}

export function TradingCardsHelpDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon" aria-label="About collectible cards">
                            <HelpCircleIcon aria-hidden />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">About collectible cards</TooltipContent>
            </Tooltip>
            <DialogContent className="flex max-h-[75vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="shrink-0 px-6 pt-6">
                    <DialogTitle>About collectible cards</DialogTitle>
                    <DialogDescription>
                        Learn what collectible cards are and how to browse the ones you have earned.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto px-6 py-6">
                    <HelpSection title="What are collectible cards?">
                        <p>
                            Collectible cards are visual rewards you earn on Jutge.org as you solve problems and
                            complete challenges. Each card belongs to a family and has its own artwork.
                        </p>
                        <p>
                            Collectible cards are awarded by the system as you solve problems and complete challenges.
                        </p>
                        <p className="flex items-center gap-2 text-xs text-yellow-500">
                            <AlertTriangleIcon aria-hidden className="size-3 shrink-0" />
                            Collectible cards are currently under development.
                        </p>
                    </HelpSection>

                    <HelpSection title="What can you do here?">
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>
                                <strong className="font-medium text-foreground">Search</strong> cards by family or
                                name.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Filter</strong> by family to focus on
                                one collection at a time.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Sort</strong> by date collected, card
                                name, or family, or shuffle them randomly.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Open</strong> a card to view it in
                                larger size.
                            </li>
                        </ul>
                    </HelpSection>

                    <HelpSection title="How are collectible cards generated?">
                        <p>Cards are generated using AI, in particular with Gemini, as you can see in their watermark. As much as we would like to have cards drawn by human artists, we do not have the resources to do so.</p>
                    </HelpSection>
                </div>
            </DialogContent>
        </Dialog>
    )
}
