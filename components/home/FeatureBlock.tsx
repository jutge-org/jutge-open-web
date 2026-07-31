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
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2
                        className="text-balance font-bold text-3xl tracking-tight md:text-4xl"
                        id="home-features-heading"
                    >
                        Learn programming by solving problems
                    </h2>
                    <p className="mt-4 text-foreground/70 text-lg">
                    Jutge.org is a free, open educational platform that helps anyone learn to program through hands-on practice, instant feedback, and well-organized problems.
                    </p>
                    <p className="mt-4 text-foreground/70 text-lg">
                    Built for students and instructors.
                    </p>
                </div>
                MISSING
            </div>
        </section>
    )
}
