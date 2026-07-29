'use client'

import { useState } from 'react'
import { ExternalLinkIcon, LayersIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import type { TradingCardRow } from '@/lib/data/tradingCards'

type TradingCardsListProps = {
    cards: TradingCardRow[]
}

function TradingCardDialog({
    card,
    open,
    onOpenChange,
}: {
    card: TradingCardRow | null
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] w-full max-w-xl flex-col items-center gap-4 p-6">
                <DialogHeader className="w-full">
                    <DialogTitle>{card ? `Card ${card.card_id.split('/')[1].replace('.png', '')}` : 'Card'}</DialogTitle>
                </DialogHeader>
                {card && (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <a href={card.imageUrl} target="_blank" rel="noopener noreferrer">
                        <img
                            src={card.imageUrl}
                            alt={`Card ${card.card_id}`}
                            className="max-h-[80vh] w-full max-w-sm rounded-2xl object-contain"
                        />
                        </a>
                        <div className="flex w-full flex-col gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => onOpenChange(false)}
                            >
                                <XIcon className="mr-2 h-4 w-4" aria-hidden />
                                Close
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export function TradingCardsList({ cards }: TradingCardsListProps) {
    const [selected, setSelected] = useState<TradingCardRow | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    function openCard(card: TradingCardRow) {
        setSelected(card)
        setDialogOpen(true)
    }

    if (cards.length === 0) {
        return (
            <Empty className="rounded-2xl border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <LayersIcon aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>No collectible cards yet</EmptyTitle>
                    <EmptyDescription>
                        Solve problems and complete challenges on Jutge.org to earn collectible cards.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {cards.map((card) => (
                    <li key={card.card_id}>
                        <button
                            type="button"
                            onClick={() => openCard(card)}
                            className="group w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            aria-label={`View Card ${card.card_id}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={card.imageUrl}
                                alt=""
                                className="aspect-[2/3] w-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    </li>
                ))}
            </ul>
            <TradingCardDialog card={selected} open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
    )
}
