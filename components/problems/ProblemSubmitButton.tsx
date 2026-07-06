'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { SubmissionDialog } from '@/components/problems/SubmissionDialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Compiler } from '@/lib/jutge_api_client'

type ProblemSubmitButtonProps = {
    problemId: string
    compilers: Compiler[]
    defaultCompilerId?: string | null
}

export function ProblemSubmitButton({ problemId, compilers, defaultCompilerId }: ProblemSubmitButtonProps) {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="default"
                        size="icon-lg"
                        className="size-16 shrink-0 rounded-full"
                        aria-label="Submit"
                        onClick={() => setDialogOpen(true)}
                    >
                        <PlusIcon className="size-8 stroke-[1.5] shrink-0" aria-hidden />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">New submission</TooltipContent>
            </Tooltip>
            <SubmissionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                problemId={problemId}
                compilers={compilers}
                defaultCompilerId={defaultCompilerId}
            />
        </>
    )
}
