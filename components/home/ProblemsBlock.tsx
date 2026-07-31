'use client'

import { ProblemIconImage } from '@/components/problems/ProblemIconImage'
import SmoothButton from '@/components/smoothui/smooth-button'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { fetchAllAbstractProblems, type ProblemRow } from '@/lib/data/problems'
import { ArrowRightIcon, FileBracesCornerIcon, SignatureIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CARD_HEIGHT = 'min-h-80 h-80 md:h-96'
const SAMPLE_SIZE = 8

const SHOW_PROBLEM_NM = false

function pickRandomProblems(problems: ProblemRow[]): ProblemRow[] {
    const eligible = problems.filter(
        (problem) => problem.problem_nm.startsWith('P') && problem.language_ids.includes('en'),
    )
    for (let i = eligible.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[eligible[i], eligible[j]] = [eligible[j], eligible[i]]
    }
    return eligible.slice(0, SAMPLE_SIZE)
}

function PromoCard() {
    return (
        <div className={`relative flex flex-col overflow-hidden rounded-2xl border bg-muted/50 p-8 ${CARD_HEIGHT}`}>
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundSize: '22px 22px',
                    maskImage: 'radial-gradient(ellipse 80% 70% at 30% 40%, black 20%, transparent 75%)',
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-8 size-40 rounded-full bg-brand/15 blur-2xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -left-6 size-36 rounded-full bg-primary/10 blur-2xl"
            />

            <div className="relative flex h-full flex-col">
                <div className="mb-4 flex items-center gap-3">
                    <FileBracesCornerIcon className="size-8 shrink-0 text-brand" aria-hidden />
                    <h3 className="font-bold text-2xl text-foreground tracking-tight">Public problems</h3>
                </div>
                <p className="mt-3 max-w-sm text-foreground/70 text-sm leading-relaxed">
                    Thousands of programming challenges with clear statements, sample cases, and instant automatic
                    judging.
                </p>
                <p className="mt-3 max-w-sm text-foreground/70 text-sm leading-relaxed">
                    Practice&nbsp;
                    <span className="font-semibold">fundamentals</span>,&nbsp;
                    <span className="font-semibold">algorithms</span>,&nbsp;
                    <span className="font-semibold">data structures</span>,&nbsp;
                    <span className="font-semibold">contest classics</span>,&nbsp; and more — at your own pace or
                    following a course.
                </p>
                <p className="mt-3 max-w-sm text-foreground/70 text-sm leading-relaxed">
                    Enrolling to your instructor's course will give you access ven more problems!
                </p>
                <div className="mt-auto pt-6">
                    <SmoothButton asChild className="w-full sm:w-auto" color="accent" variant="candy">
                        <Link href="/problems/public">
                            <FileBracesCornerIcon className="size-4 shrink-0" aria-hidden />
                            Browse public problems
                        </Link>
                    </SmoothButton>
                </div>
            </div>
        </div>
    )
}

function ProblemListItem({ problem }: { problem: ProblemRow }) {
    return (
        <li>
            <Link
                href={`/problems/${problem.problem_nm}_en`}
                className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                {problem.iconUrl ? (
                    <ProblemIconImage iconUrl={problem.iconUrl} size="md" className="shrink-0" />
                ) : (
                    <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground"
                        aria-hidden
                    >
                        <FileBracesCornerIcon className="size-5" />
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground text-sm">{problem.title}</div>
                    {SHOW_PROBLEM_NM && (
                        <div className="mt-0.5 flex min-w-0 items-center gap-1 text-muted-foreground text-xs">
                            <span className="shrink-0">{problem.problem_nm}</span>
                        </div>
                    )}
                    <div className="mt-0.5 flex min-w-0 items-center gap-1 text-muted-foreground text-xs">
                        {problem.author ? (
                            <>
                                <SignatureIcon className="size-3 shrink-0" aria-hidden />
                                <span className="truncate">{problem.author}</span>
                            </>
                        ) : null}
                    </div>
                </div>
            </Link>
        </li>
    )
}

function ProblemsListCard({ problems }: { problems: ProblemRow[] | null }) {
    return (
        <div
            className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card p-4 shadow-sm ${CARD_HEIGHT}`}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -left-8 size-40 rounded-full bg-brand/15 blur-2xl"
            />
            <div className="relative mb-2 flex shrink-0 items-center justify-between gap-2 px-2 pt-1">
                <h3 className="font-semibold text-foreground text-lg">Sample public problems</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 text-muted-foreground"
                                asChild
                            >
                                <Link href="/problems/public" aria-label="Browse all public problems">
                                    <ArrowRightIcon className="size-4" aria-hidden />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Browse all public problems</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
                {problems === null ? (
                    <div className="flex h-full items-center justify-center" aria-busy="true" aria-live="polite">
                        <div
                            className="size-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground"
                            role="status"
                            aria-label="Loading problems"
                        />
                    </div>
                ) : problems.length === 0 ? (
                    <p className="px-2 py-8 text-center text-muted-foreground text-sm">
                        No public problems available right now.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-0 pb-1">
                        {problems.map((problem) => (
                            <ProblemListItem key={problem.problem_nm} problem={problem} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export function ProblemsBlock() {
    const shouldReduceMotion = useReducedMotion()
    const [problems, setProblems] = useState<ProblemRow[] | null>(null)

    useEffect(() => {
        let cancelled = false
        void fetchAllAbstractProblems('en').then((rows) => {
            if (!cancelled) setProblems(pickRandomProblems(rows))
        })
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <section id="home-problems" aria-labelledby="home-problems-heading" className="scroll-mt-14">
            <div className="mx-auto max-w-5xl px-6">
                <motion.div
                    className="mx-auto mb-12 max-w-2xl text-center"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.35, bounce: 0.1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                >
                    <h2
                        className="text-balance font-bold text-3xl tracking-tight md:text-4xl"
                        id="home-problems-heading"
                    >
                        Solve curated problems
                    </h2>
                    <p className="mt-4 text-foreground/70 text-lg">
                        Warm up with a fresh sample of classic challenges — then dive into the full catalogue when you
                        are ready for more.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                >
                    <PromoCard />
                    <ProblemsListCard problems={problems} />
                </motion.div>
            </div>
        </section>
    )
}
