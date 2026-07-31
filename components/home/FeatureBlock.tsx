'use client'

import { cn } from '@/lib/utils'
import { BookOpenIcon, BookTextIcon, FileBracesCornerIcon, InfoIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const SPRING = {
    type: 'spring' as const,
    duration: 0.25,
    bounce: 0.1,
}

const features = [
    {
        title: 'Courses',
        description: 'Explore public courses with curated problem lists, lessons, and practice paths for every level.',
        href: '/courses/public',
        icon: BookOpenIcon,
    },
    {
        title: 'Problems',
        description: 'Browse thousands of programming problems with statements, sample cases, and automatic judging.',
        href: '/problems/public',
        icon: FileBracesCornerIcon,
    },
    {
        title: 'Documentation',
        description: 'Learn how to submit, read verdicts, use compilers, and get the most out of the platform.',
        href: '/documentation',
        icon: BookTextIcon,
    },
    {
        title: 'About',
        description: 'Discover the story behind Jutge.org, the team, and the institutions that support it.',
        href: '/about',
        icon: InfoIcon,
    },
]

export function FeatureBlock() {
    const shouldReduceMotion = useReducedMotion()
    const [isHoverDevice, setIsHoverDevice] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
        setIsHoverDevice(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    return (
        <section id="home-features" aria-labelledby="home-features-heading" className="scroll-mt-14">
            <div className="py-16 md:py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2
                            className="text-balance font-bold text-3xl tracking-tight md:text-4xl"
                            id="home-features-heading"
                        >
                            TODO: Learn and teach programming
                        </h2>
                        <p className="mt-4 text-foreground/70 text-lg">
                            Courses, problems, exams, contests, and more — built for students and instructors.
                        </p>
                    </div>
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <motion.li
                                    className={cn(
                                        'rounded-xl border bg-background transition-shadow',
                                        isHoverDevice && !shouldReduceMotion && 'hover:shadow-md',
                                    )}
                                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                                    key={feature.title}
                                    transition={
                                        shouldReduceMotion ? { duration: 0 } : { ...SPRING, delay: index * 0.05 }
                                    }
                                    viewport={{ once: true, margin: '-100px' }}
                                    whileHover={isHoverDevice && !shouldReduceMotion ? { y: -4 } : undefined}
                                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                >
                                    <Link
                                        href={feature.href}
                                        className="flex h-full flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                                            <Icon className="size-6" aria-hidden />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                                        <p className="text-foreground/70 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </Link>
                                </motion.li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </section>
    )
}
