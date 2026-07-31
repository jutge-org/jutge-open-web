'use client'

import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'

const SPRING = {
    type: 'spring' as const,
    duration: 0.25,
    bounce: 0.1,
}

const relatedSites = [
    {
        title: 'Quizzes by Jutge.org',
        description: 'Play and learn, share your knowledge — wrong answers welcome! Currently under development.',
        href: 'https://quizzes.jutge.org',
        imageSrc: '/news/quizzes-jutge.png',
    },
    {
        title: 'VSCode extension',
        description: 'Solve Jutge.org problems directly within your favorite IDE.',
        href: 'vscode:extension/jutge-org.jutge-vscode',
        imageSrc: '/news/vscode-jutge.png',
    },
    {
        title: 'API for Jutge.org',
        description:
            'Write programs to interact with Jutge.org: obtain information, test AIs, configure things automatically.',
        href: 'https://api.jutge.org',
        imageSrc: '/news/api-jutge.png',
    },
    {
        title: 'Lliçons',
        description: "El recull de lliçons d'algorísmia i programació de Jutge.org.",
        href: 'https://lliçons.jutge.org',
        imageSrc: '/news/llicons.png',
    },
]

export function RelatedSitesBlock() {
    const shouldReduceMotion = useReducedMotion()

    return (
        <section id="home-related-sites" aria-labelledby="home-related-sites-heading" className="scroll-mt-14">
            <div className="py-16 md:py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2
                            className="text-balance font-bold text-3xl tracking-tight md:text-4xl"
                            id="home-related-sites-heading"
                        >
                            Related sites and tools
                        </h2>
                        <p className="mt-4 text-foreground/70 text-lg">
                            More tools and resources from the Jutge.org ecosystem.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {relatedSites.map((site, index) => {
                            const isExternal = site.href.startsWith('http')
                            return (
                                <motion.a
                                    className="group relative flex h-full flex-col items-center overflow-hidden rounded-xl border bg-primary/5 p-6 text-center ring-1 ring-primary/10 transition-all hover:scale-105 hover:shadow-md"
                                    href={site.href}
                                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                                    key={site.title}
                                    rel={isExternal ? 'noopener noreferrer' : undefined}
                                    target={isExternal ? '_blank' : undefined}
                                    transition={
                                        shouldReduceMotion ? { duration: 0 } : { ...SPRING, delay: index * 0.05 }
                                    }
                                    viewport={{ once: true, margin: '-100px' }}
                                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                                >
                                    <Image
                                        src={site.imageSrc}
                                        alt=""
                                        width={64}
                                        height={64}
                                        className="mb-3 size-14 rounded-md object-contain"
                                    />
                                    <h3 className="mb-1 font-semibold text-brand">
                                        {site.title}
                                        {isExternal ? <span className="sr-only"> (opens in new window)</span> : null}
                                    </h3>
                                    <p className="text-foreground/70 text-sm leading-relaxed">{site.description}</p>

                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    />
                                </motion.a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
