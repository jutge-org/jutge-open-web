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

export function CoursesHelpDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon" aria-label="About courses">
                            <HelpCircleIcon aria-hidden />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">About courses</TooltipContent>
            </Tooltip>
            <DialogContent className="flex max-h-[75vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="shrink-0 px-6 pt-6">
                    <DialogTitle>About courses</DialogTitle>
                    <DialogDescription>
                        Learn what courses are, what they include, and how to manage your enrollment.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto px-6 py-6">
                    <HelpSection title="What are courses?">
                        <p>
                            Courses on Jutge.org are collections of programming problems organized by an instructor for
                            a class or learning group. They provide a structured path through problem lists and let
                            instructors follow student progress.
                        </p>
                    </HelpSection>

                    <HelpSection title="What do courses contain?">
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>A title, description, and instructor name.</li>
                            <li>
                                Problem lists with programming exercises. Lists and your submission progress are
                                available once you are enrolled.
                            </li>
                            <li>
                                Badges that describe the course:{' '}
                                <strong className="font-medium text-foreground">Official</strong> (verified by Jutge),{' '}
                                <strong className="font-medium text-foreground">Public</strong> (visible without
                                enrollment), and <strong className="font-medium text-foreground">Instructor</strong>{' '}
                                (you own the course).
                            </li>
                        </ul>
                    </HelpSection>

                    <HelpSection title="What can you do with courses?">
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>
                                <strong className="font-medium text-foreground">Enroll</strong> in a course from the
                                Available tab to access its problem lists and track your progress.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Open</strong> a course to view its
                                details and, when enrolled, work through its problem lists.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Archive</strong> or{' '}
                                <strong className="font-medium text-foreground">unarchive</strong> courses to organize
                                your Enrolled list without leaving the course.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Unenroll</strong> to leave a course.
                                Your instructor will no longer see your progress, but you can enroll again later.
                            </li>
                            <li>
                                If you are the instructor, use{' '}
                                <strong className="font-medium text-foreground">Edit</strong> to manage course
                                properties.
                            </li>
                            <li>
                                Use search, filters, and sorting to find courses by title or author, or to narrow
                                results by official status and instructor role.
                            </li>
                        </ul>
                    </HelpSection>

                    <HelpSection title="Enrolled, available, and archived">
                        <ul className="list-disc space-y-1.5 pl-5">
                            <li>
                                <strong className="font-medium text-foreground">Enrolled</strong> — courses you are
                                actively taking part in. They appear on your main courses view and give you access to
                                problem lists and progress tracking.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Available</strong> — courses you can
                                join but are not enrolled in yet. Browse them here and enroll when you are ready.
                            </li>
                            <li>
                                <strong className="font-medium text-foreground">Archived</strong> — courses you are
                                still enrolled in but have chosen to hide from the Enrolled tab. Archiving helps keep
                                your active courses organized; you remain enrolled and can unarchive a course at any
                                time.
                            </li>
                        </ul>
                    </HelpSection>
                </div>
            </DialogContent>
        </Dialog>
    )
}
