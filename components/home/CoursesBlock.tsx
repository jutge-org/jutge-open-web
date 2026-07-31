'use client'

import { CourseIconImage } from '@/components/courses/CourseIconImage'
import SmoothButton from '@/components/smoothui/smooth-button'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { fetchPublicCourses } from '@/lib/data/courses'
import { publicCourseHref, type GuestCourseRow } from '@/lib/courses'
import { ArrowRightIcon, BookOpenIcon, SignatureIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CARD_HEIGHT = 'min-h-80 h-80 md:h-96'

/** Featured public courses shown on the home page, ordered by preference. Values are course keys (`username:course_nm`). */
const FEATURED_COURSE_NMS = [
    'Jutge:Programming',
    'Jutge:Algorithms',
    'Jutge:Graphic_Problems',
    'JordiCortadella:IntroCircuits',
    'Jutge:Haskell',
    'GerardEscudero:clojureCAP',
    'Jutge:oicat_problems',
    'Jutge:OIE',
]

function filterFeaturedCourses(courses: GuestCourseRow[]): GuestCourseRow[] {
    const byKey = new Map(courses.map((course) => [course.course_key, course]))
    const featured = FEATURED_COURSE_NMS.flatMap((courseKey) => {
        const course = byKey.get(courseKey)
        return course ? [course] : []
    })
    for (let i = featured.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[featured[i], featured[j]] = [featured[j], featured[i]]
    }
    return featured
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
                className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-brand/15 blur-2xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -left-6 size-36 rounded-full bg-primary/10 blur-2xl"
            />

            <div className="relative flex h-full flex-col">
                <div className="mb-4 flex items-center gap-3">
                    <BookOpenIcon className="size-8 shrink-0 text-brand" aria-hidden />
                    <h3 className="font-bold text-2xl text-foreground tracking-tight">Public courses</h3>
                </div>
                <p className="mt-3 max-w-sm text-foreground/70 text-sm leading-relaxed">
                    Curated problem lists and learning paths, open to everyone.
                </p>
                <p className="mt-3 max-w-sm text-foreground/70 text-sm leading-relaxed">
                    Pick topics as&nbsp;
                    <span className="font-semibold">Introduction to Programming</span>,&nbsp;
                    <span className="font-semibold">Functional Programming</span>,&nbsp;
                    <span className="font-semibold">Algorithmics</span>,&nbsp;
                    <span className="font-semibold">Circuit Design</span>,&nbsp;
                    <span className="font-semibold">Official contests</span>,&nbsp; etc.
                </p>
                <div className="mt-auto pt-6">
                    <SmoothButton asChild className="w-full sm:w-auto" color="accent" variant="candy">
                        <Link href="/courses/public">
                            <BookOpenIcon className="size-4 shrink-0" aria-hidden />
                            Browse public courses
                        </Link>
                    </SmoothButton>
                </div>
            </div>
        </div>
    )
}

function CourseListItem({ course }: { course: GuestCourseRow }) {
    return (
        <li>
            <Link
                href={publicCourseHref(course.course_key)}
                className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                <CourseIconImage iconUrl={course.iconUrl} size="sm" />
                <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground text-sm">{course.title}</div>
                    <div className="mt-0.5 flex min-w-0 items-center gap-1 text-muted-foreground text-xs">
                        <SignatureIcon className="size-3 shrink-0" aria-hidden />
                        <span className="truncate">{course.ownerName}</span>
                    </div>
                </div>
            </Link>
        </li>
    )
}

function CoursesListCard({ courses }: { courses: GuestCourseRow[] | null }) {
    return (
        <div
            className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card p-4 shadow-sm ${CARD_HEIGHT}`}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -left-8 -top-8 size-40 rounded-full bg-brand/15 blur-2xl"
            />
            <div className="relative mb-2 flex shrink-0 items-center justify-between gap-2 px-2 pt-1">
                <h3 className="font-semibold text-foreground text-lg">Featured public courses</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 text-muted-foreground"
                                asChild
                            >
                                <Link href="/courses/public" aria-label="Browse all public courses">
                                    <ArrowRightIcon className="size-4" aria-hidden />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Browse all public courses</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
                {courses === null ? (
                    <div className="flex h-full items-center justify-center" aria-busy="true" aria-live="polite">
                        <div
                            className="size-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground"
                            role="status"
                            aria-label="Loading courses"
                        />
                    </div>
                ) : courses.length === 0 ? (
                    <p className="px-2 py-8 text-center text-muted-foreground text-sm">
                        No public courses available right now.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-0 pb-1">
                        {courses.map((course) => (
                            <CourseListItem key={course.course_key} course={course} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export function CoursesBlock() {
    const shouldReduceMotion = useReducedMotion()
    const [courses, setCourses] = useState<GuestCourseRow[] | null>(null)

    useEffect(() => {
        let cancelled = false
        void fetchPublicCourses().then((rows) => {
            if (!cancelled) setCourses(filterFeaturedCourses(rows))
        })
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <section id="home-courses" aria-labelledby="home-courses-heading" className="scroll-mt-14">
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
                        id="home-courses-heading"
                    >
                        Learn with guided courses
                    </h2>
                    <p className="mt-4 text-foreground/70 text-lg">
                        Follow curated paths from your own instructors worldwide — or jump to public courses for all
                        levels and topics.
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
                    <CoursesListCard courses={courses} />
                </motion.div>
            </div>
        </section>
    )
}
