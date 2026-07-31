'use client'

import { GraduationCapIcon, SparklesIcon, UserIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

type FeatureCardData = {
    title: string
    tagline: string
    icon: LucideIcon
    features: string[]
    variant: 'muted' | 'card'
}

type WhyItem = {
    header: string
    body: string
}

const cards: FeatureCardData[] = [
    {
        title: 'Features for students',
        tagline: 'Learn by solving real graded programming problems',
        icon: UserIcon,
        variant: 'muted',
        features: [
            'Instant automated feedback on every submission',
            'Thousands of organized problems by topic and difficulty',
            'Support for many programming languages',
            'Track your progress and improve through practice',
            'Assignments, contests, and exams in one place',
        ],
    },
    {
        title: 'Features for instructors',
        tagline: 'Everything you need to run programming courses',
        icon: GraduationCapIcon,
        variant: 'card',
        features: [
            'Create and manage courses with your students and teaching assistants',
            'Build assignments, contests, and exams',
            'Reuse or create programming problems',
            'Automatic grading with scalable assessment',
            'Monitor student progress through submissions and results',
        ],
    },
]

const whyItems: WhyItem[] = [
    {
        header: 'Purpose-built for Computer Science Education',
        body: 'Designed specifically for learning and teaching programming.',
    },
    {
        header: 'Millions of Automatic Evaluations',
        body: 'A mature platform proven through years of continuous academic use.',
    },
    {
        header: 'Immediate, Meaningful Feedback',
        body: 'Students learn faster by testing, correcting, and resubmitting their solutions.',
    },
    {
        header: 'Reliable Assessment at Scale',
        body: 'Automatic grading ensures consistency while saving instructors countless hours.',
    },
    {
        header: 'Rich Programming Problem Library',
        body: 'Thousands of curated exercises spanning many topics and difficulty levels.',
    },
    {
        header: 'Research-backed Platform',
        body: 'Developed and improved through years of educational research and publications, with innovations validated in real university courses.',
    },
]

function FeatureCard({ title, tagline, icon: Icon, features, variant }: FeatureCardData) {
    return (
        <div
            className={
                variant === 'muted'
                    ? 'relative flex flex-col overflow-hidden rounded-2xl border bg-muted/50 p-8'
                    : 'relative flex flex-col overflow-hidden rounded-2xl border bg-card p-8 shadow-sm'
            }
        >
            {variant === 'muted' ? (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.35]"
                    style={{
                        backgroundSize: '22px 22px',
                        maskImage:
                            'radial-gradient(ellipse 80% 70% at 30% 40%, black 20%, transparent 75%)',
                    }}
                />
            ) : null}
            {variant === 'muted' ? (
                <>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 -right-8 size-40 -translate-y-1/2 rounded-full bg-brand/15 blur-2xl"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 -left-6 size-36 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl"
                    />
                </>
            ) : (
                <>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 -left-8 size-40 -translate-y-1/2 rounded-full bg-brand/15 blur-2xl"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 -right-6 size-36 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl"
                    />
                </>
            )}

            <div className="relative flex h-full flex-col">
                <div className="mb-4 flex items-center gap-3">
                    <Icon className="size-8 shrink-0 text-brand" aria-hidden />
                    <h3 className="font-bold text-2xl text-foreground tracking-tight">{title}</h3>
                </div>
                <p className="max-w-sm text-foreground/70 text-sm leading-relaxed">{tagline}</p>
                <ul className="mt-6 flex flex-col gap-3">
                    {features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-foreground text-sm leading-relaxed">
                            <span
                                aria-hidden
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                            />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

function WhyJutgeCard() {
    return (
        <div className="relative flex flex-col overflow-hidden rounded-2xl border bg-muted/50 p-8 md:col-span-2">
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 -right-8 size-40 -translate-y-1/2 rounded-full bg-brand/15 blur-2xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 -left-6 size-36 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl"
            />

            <div className="relative flex h-full flex-col">
                <div className="mb-6 flex items-center gap-3">
                    <SparklesIcon className="size-8 shrink-0 text-brand" aria-hidden />
                    <h3 className="font-bold text-2xl text-foreground tracking-tight">Why Jutge.org?</h3>
                </div>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {whyItems.map((item) => (
                        <li key={item.header} className="flex gap-3 text-foreground text-sm leading-relaxed">
                            <span
                                aria-hidden
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                            />
                            <span>
                                <strong className="font-semibold">{item.header}</strong>
                                <br />
                                <span className="text-foreground/70">{item.body}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export function FeatureBlock() {
    const shouldReduceMotion = useReducedMotion()

    return (
        <section id="home-features" aria-labelledby="home-features-heading" className="scroll-mt-14">
            <div className="mx-auto max-w-5xl px-6">
                <motion.div
                    className="mx-auto mb-12 max-w-2xl text-center"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    transition={
                        shouldReduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.35, bounce: 0.1 }
                    }
                    viewport={{ once: true, margin: '-80px' }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                >
                    <h2
                        className="text-balance font-bold text-3xl tracking-tight md:text-4xl"
                        id="home-features-heading"
                    >
                        Learn programming by solving problems
                    </h2>
                    <p className="mt-4 text-foreground/70 text-lg">
                        Jutge.org is a free, open educational platform that helps anyone learn to program through
                        hands-on practice, instant feedback, and well-organized problems.
                    </p>
                    <p className="mt-4 text-foreground/70 text-lg">Built for students and instructors.</p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    transition={
                        shouldReduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.1 }
                    }
                    viewport={{ once: true, margin: '-80px' }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                >
                    {cards.map((card) => (
                        <FeatureCard key={card.title} {...card} />
                    ))}
                    <WhyJutgeCard />
                </motion.div>
            </div>
        </section>
    )
}
