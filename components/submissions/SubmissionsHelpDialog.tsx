'use client'

import { HelpCircleIcon } from 'lucide-react'
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

export function SubmissionsHelpDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon" aria-label="About submissions">
                            <HelpCircleIcon aria-hidden />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">About submissions</TooltipContent>
            </Tooltip>
            <DialogContent className="flex max-h-[75vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="shrink-0 px-6 pt-6">
                    <DialogTitle>About submissions</DialogTitle>
                    <DialogDescription>
                        Learn what submissions are, how verdicts work, and how to use this page.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto px-6 py-6">
                    <HelpSection title="What are submissions?">
                        <p>
                            A submission is a solution you send to the judge for a programming problem. Each row in this
                            list is one submission, with its problem, compiler, verdict, and submission time.
                        </p>
                    </HelpSection>

                    <HelpSection title="Verdicts">
                        <p>
                            After judging, each submission receives a verdict. The emoji column gives a quick visual
                            cue; hover the verdict name for the full description.
                        </p>
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>
                                <strong className="font-medium text-foreground">Accepted (AC)</strong> — your solution
                                passed all test cases.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Pending</strong> — the judge is still
                                evaluating your submission. The list refreshes automatically until a verdict is ready.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Rejected</strong> — the submission
                                finished judging but did not pass all test cases (for example WA, TLE, or CE).
                            </li>
                        </ul>
                    </HelpSection>

                    <HelpSection title="What can you do here?">
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>
                                <strong className="font-medium text-foreground">Search</strong> submissions by problem,
                                submission id, verdict, compiler, or annotation.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Filter</strong> by verdict to focus on
                                accepted, pending, or rejected submissions.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Toggle columns</strong> to show or hide
                                problem, submission id, verdict, compiler, time, and annotation.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Open</strong> a submission to review its
                                source code, analysis, and test case results.
                            </li>
                            <li>Hover problem ids, compilers, and verdicts for additional details.</li>
                        </ul>
                    </HelpSection>
                </div>
            </DialogContent>
        </Dialog>
    )
}
