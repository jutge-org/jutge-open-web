'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SaveIcon } from 'lucide-react'

type SaveFileIconButtonProps = {
    onClick: () => void | Promise<void>
    disabled?: boolean
    tooltip: string
    'aria-label': string
}

export function SaveFileIconButton({ onClick, disabled, tooltip, 'aria-label': ariaLabel }: SaveFileIconButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8"
                    disabled={disabled}
                    onClick={() => void onClick()}
                    aria-label={ariaLabel}
                >
                    <SaveIcon className="size-4" aria-hidden />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    )
}
