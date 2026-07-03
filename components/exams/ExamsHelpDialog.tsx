'use client'

import { HelpCircleIcon, PenLineIcon, TrophyIcon } from 'lucide-react'
import { useState } from 'react'

import { ExternalLink } from '@/components/ExternalLink'
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

const examTypes = [
    {
        Icon: PenLineIcon,
        label: 'Exam',
        description:
            'A timed session linked to a course where you solve programming problems. Exams take place at exam.jutge.org.',
        href: 'https://exam.jutge.org',
    },
    {
        Icon: TrophyIcon,
        label: 'Contest',
        description:
            'Works almost the same as an exam, but includes a public leaderboard where participants can see rankings during and after the event. Contests take place at contest.jutge.org.',
        href: 'https://contest.jutge.org',
    },
] as const

export function ExamsHelpDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon" aria-label="About exams">
                            <HelpCircleIcon aria-hidden />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">About exams</TooltipContent>
            </Tooltip>
            <DialogContent className="flex max-h-[75vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="shrink-0 px-6 pt-6">
                    <DialogTitle>About exams and contests</DialogTitle>
                    <DialogDescription>
                        Learn what exams and contests are, how they differ, and how to use this page.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto px-6 py-6">
                    <HelpSection title="What are exams and contests?">
                        <p>
                            Exams and contests are timed programming sessions linked to a course. During the scheduled
                            window, you solve a set of problems using the dedicated exam or contest platform.
                        </p>
                    </HelpSection>

                    <HelpSection title="Exams vs contests">
                        <p>
                            Exams and contests are almost the same: both are course-linked, timed events where you
                            submit solutions to programming problems. The main difference is that{' '}
                            <strong className="font-medium text-foreground">contests have a public leaderboard</strong>{' '}
                            showing participant rankings, while exams do not.
                        </p>
                        <ul className="space-y-2">
                            {examTypes.map(({ Icon, label, description, href }) => (
                                <li key={label} className="flex items-start gap-2">
                                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                                    <span>
                                        <strong className="font-medium text-foreground">{label}</strong> — {description}{' '}
                                        <ExternalLink href={href} className="text-foreground hover:underline">
                                            {href.replace('https://', '')}
                                        </ExternalLink>
                                        .
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </HelpSection>

                    <HelpSection title="What does each entry show?">
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>Title, course, and instructor.</li>
                            <li>Start time and place, when provided.</li>
                            <li>
                                Status: <strong className="font-medium text-foreground">Upcoming</strong> (not started
                                yet), <strong className="font-medium text-foreground">In progress</strong> (currently
                                running), or <strong className="font-medium text-foreground">Finished</strong> (ended).
                            </li>
                        </ul>
                    </HelpSection>

                    <HelpSection title="What can you do here?">
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>
                                <strong className="font-medium text-foreground">Search</strong> exams and contests by
                                title, course, instructor, place, or description.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Filter</strong> by type (exam or
                                contest) and by status (upcoming, in progress, or finished).
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Sort</strong> by date, title, course,
                                or instructor.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Open</strong> an entry to view its full
                                details.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Add to calendar</strong> using the
                                calendar button on a card or detail page.
                            </li>
                            <li>
                                When an event is running, go to{' '}
                                <ExternalLink href="https://exam.jutge.org" className="text-foreground hover:underline">
                                    exam.jutge.org
                                </ExternalLink>{' '}
                                or{' '}
                                <ExternalLink
                                    href="https://contest.jutge.org"
                                    className="text-foreground hover:underline"
                                >
                                    contest.jutge.org
                                </ExternalLink>{' '}
                                to participate.
                            </li>
                        </ul>
                    </HelpSection>
                </div>
            </DialogContent>
        </Dialog>
    )
}
