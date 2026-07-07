'use client'

import { GaugeIcon, HelpCircleIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { useState } from 'react'

import { ProblemTypeIcon } from '@/components/problems/ProblemTypeIcon'
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

const problemTypes = [
    {
        type: 'std',
        description:
            'Standard programming problem. Read the statement, write code in a supported compiler, submit a solution, and receive a verdict.',
    },
    {
        type: 'graphic',
        description: 'Graphic output problem. Your program output is compared as an image rather than plain text.',
    },
    {
        type: 'game',
        description:
            'Game problem. Players and competitions are managed on the dedicated games platform rather than through regular submissions.',
    },
    {
        type: 'quiz',
        description:
            'Multiple-choice quiz. Quiz problems are not yet supported in this interface; use jutge.org to take them.',
    },
    {
        type: 'circuits',
        description: 'Circuit or logic problem with a specialized evaluation model.',
    },
] as const

const statusIndicators = [
    {
        Icon: ThumbsUpIcon,
        label: 'Accepted',
        description: 'Your latest submission passed all test cases.',
        className: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        Icon: ThumbsDownIcon,
        label: 'Rejected',
        description: 'Your latest submission did not pass all test cases.',
        className: 'text-red-600 dark:text-red-400',
    },
    {
        Icon: GaugeIcon,
        label: 'Scored',
        description: 'Your latest submission was scored but not fully accepted.',
        className: 'text-orange-600 dark:text-orange-400',
    },
] as const

export function ProblemsHelpDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon" aria-label="About problems">
                            <HelpCircleIcon aria-hidden />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">About problems</TooltipContent>
            </Tooltip>
            <DialogContent className="flex max-h-[75vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="shrink-0 px-6 pt-6">
                    <DialogTitle>About problems</DialogTitle>
                    <DialogDescription>
                        Learn what problems are, how languages and types work, and how to use this page.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto px-6 py-6">
                    <HelpSection title="What are problems?">
                        <p>
                            Problems on Jutge.org are programming exercises with a statement, public test cases, and one
                            or more supported compilers. Each problem has a unique identifier (for example,{' '}
                            <strong className="font-medium text-foreground">P12345</strong>) and may be available in
                            several languages.
                        </p>
                    </HelpSection>

                    <HelpSection title="Languages">
                        <p>
                            Many problems are published in more than one language. Each language variant has its own
                            statement and title, identified by a language code such as{' '}
                            <strong className="font-medium text-foreground">en</strong>,{' '}
                            <strong className="font-medium text-foreground">ca</strong>, or{' '}
                            <strong className="font-medium text-foreground">es</strong>.
                        </p>
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>
                                The <strong className="font-medium text-foreground">Languages</strong> column shows
                                which variants exist for each problem. Hover a badge to see the full language name.
                            </li>
                            <li>Titles in the list follow your preferred language when a translation is available.</li>
                            <li>
                                Open a problem to switch between language variants using the language badges on the
                                detail page.
                            </li>
                        </ul>
                    </HelpSection>

                    <HelpSection title="Problem types">
                        <p>
                            The <strong className="font-medium text-foreground">Type</strong> column shows an icon for
                            the problem driver. Each type behaves differently:
                        </p>
                        <ul className="space-y-2">
                            {problemTypes.map(({ type, description }) => (
                                <li key={type} className="flex items-start gap-2">
                                    <ProblemTypeIcon type={type} showTooltip={false} className="mt-0.5 shrink-0" />
                                    <span>
                                        <strong className="font-medium text-foreground">{type}</strong> — {description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </HelpSection>

                    <HelpSection title="Your status">
                        <p>
                            When signed in, the <strong className="font-medium text-foreground">Status</strong> column
                            shows how you did on your latest submission:
                        </p>
                        <ul className="space-y-2">
                            {statusIndicators.map(({ Icon, label, description, className }) => (
                                <li key={label} className="flex items-start gap-2">
                                    <Icon className={`mt-0.5 size-4 shrink-0 ${className}`} aria-hidden />
                                    <span>
                                        <strong className="font-medium text-foreground">{label}</strong> — {description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p>Hover a status icon in the table for submission counts and details.</p>
                    </HelpSection>

                    <HelpSection title="What can you do here?">
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>
                                <strong className="font-medium text-foreground">Search</strong> problems by id, title,
                                author, language, or type using the search box.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Advanced search</strong> finds problems
                                by full text or semantic similarity in statements.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Toggle columns</strong> to show or hide
                                status, id, title, author, languages, and type.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Open</strong> a problem to read its
                                statement, view test cases, and submit solutions.
                            </li>
                            <li>Hover a problem id or title for a quick summary with author, translator, and tags.</li>
                        </ul>
                    </HelpSection>
                </div>
            </DialogContent>
        </Dialog>
    )
}
