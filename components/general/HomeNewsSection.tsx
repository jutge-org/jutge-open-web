'use client'

import { RefreshCwIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { HomeSectionHeading } from '@/components/general/HomeSectionHeading'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HOME_NEWS_DISMISSED_STORAGE_KEY, type HomeNewsItemId, parseHomeNewsDismissedIds } from '@/lib/home-news'
import { cn } from '@/lib/utils'

type HomeNewsItem = {
    id: HomeNewsItemId
    title: string
    imageSrc: string
    imageHref: string
    children: React.ReactNode
}

const newsLinkClassName = 'text-primary underline-offset-4 hover:underline'

const newsItems: HomeNewsItem[] = [
    {
        id: 'quizzes',
        title: 'New: Quizzes by Jutge.org',
        imageSrc: '/news/quizzes-jutge.png',
        imageHref: 'https://quizzes.jutge.org',
        children: (
            <>
                <p>
                    Try{' '}
                    <a href="https://quizzes.jutge.org" target="_blank" rel="noreferrer" className={newsLinkClassName}>
                        quizzes.jutge.org
                    </a>
                    : Play and learn, share your knowledge, wrong answers welcome!
                </p>
                <p>
                    Quizzes is currently under development. We appreciate your{' '}
                    <a
                        href="https://feedback-quizzes.jutge.org"
                        target="_blank"
                        rel="noreferrer"
                        className={newsLinkClassName}
                    >
                        feedback
                    </a>
                    .
                </p>
            </>
        ),
    },
    {
        id: 'vscode',
        title: 'New: Experimental VSCode extension',
        imageSrc: '/news/vscode-jutge.png',
        imageHref: 'vscode:extension/jutge-org.jutge-vscode',
        children: (
            <>
                <p>
                    Try the new{' '}
                    <a href="vscode:extension/jutge-org.jutge-vscode" className={newsLinkClassName}>
                        Jutge VSCode Extension
                    </a>{' '}
                    to solve Jutge.org problems directly within your favorite IDE.
                </p>
                <p>
                    Do you wish to contribute? See the{' '}
                    <a
                        href="https://github.com/jutge-org/jutge-vscode"
                        target="_blank"
                        rel="noreferrer"
                        className={newsLinkClassName}
                    >
                        repository
                    </a>
                    .
                </p>
            </>
        ),
    },
    {
        id: 'api',
        title: 'New: API Jutge.org',
        imageSrc: '/news/api-jutge.png',
        imageHref: 'https://api.jutge.org',
        children: (
            <>
                <p className="text-lg font-medium leading-snug">
                    <a href="https://api.jutge.org" target="_blank" rel="noreferrer" className={newsLinkClassName}>
                        api.jutge.org
                    </a>
                </p>
                <p>
                    Write programs to interact with Jutge.org: obtain information, test AIs, configure things
                    automatically...
                </p>
            </>
        ),
    },
    {
        id: 'llicons',
        title: 'Lliçons',
        imageSrc: '/news/llicons.png',
        imageHref: 'https://lliçons.jutge.org',
        children: (
            <>
                <p className="text-lg font-medium leading-snug">
                    <a href="https://lliçons.jutge.org" target="_blank" rel="noreferrer" className={newsLinkClassName}>
                        lliçons.jutge.org
                    </a>
                </p>
                <p>El recull de lliçons d&apos;algorísmia i programació de Jutge.org.</p>
            </>
        ),
    },
]

function HomeNewsCard({ item, onDismiss }: { item: HomeNewsItem; onDismiss: (id: HomeNewsItemId) => void }) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
                <h3 className="text-sm font-semibold leading-snug text-foreground">{item.title}</h3>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 shrink-0 text-muted-foreground"
                            onClick={() => onDismiss(item.id)}
                            aria-label={`Dismiss ${item.title}`}
                        >
                            <XIcon className="size-3.5" aria-hidden />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Dismiss</TooltipContent>
                </Tooltip>
            </div>
            <div className="flex flex-1 gap-5 p-4">
                <a
                    href={item.imageHref}
                    target={item.imageHref.startsWith('http') ? '_blank' : undefined}
                    rel={item.imageHref.startsWith('http') ? 'noreferrer' : undefined}
                    className="shrink-0"
                >
                    <Image
                        src={item.imageSrc}
                        alt=""
                        width={80}
                        height={80}
                        className="p-1 size-22 rounded-md border border-border object-contain"
                    />
                </a>
                <div className={cn('flex min-w-0 flex-1 flex-col gap-2 text-sm leading-relaxed text-muted-foreground')}>
                    {item.children}
                </div>
            </div>
        </article>
    )
}

export function HomeNewsSection() {
    const [dismissedIds, setDismissedIds] = useState<HomeNewsItemId[]>([])
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setDismissedIds(parseHomeNewsDismissedIds(localStorage.getItem(HOME_NEWS_DISMISSED_STORAGE_KEY)))
        setReady(true)
    }, [])

    function dismiss(id: HomeNewsItemId) {
        setDismissedIds((prev) => {
            if (prev.includes(id)) return prev

            const next = [...prev, id]
            localStorage.setItem(HOME_NEWS_DISMISSED_STORAGE_KEY, JSON.stringify(next))
            return next
        })
    }

    function restoreAll() {
        localStorage.removeItem(HOME_NEWS_DISMISSED_STORAGE_KEY)
        setDismissedIds([])
    }

    const visibleItems = ready ? newsItems.filter((item) => !dismissedIds.includes(item.id)) : newsItems

    return (
        <TooltipProvider>
            <section aria-label="News" className="flex flex-col gap-4">
                <HomeSectionHeading>
                    <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">News</h2>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 text-muted-foreground"
                                onClick={restoreAll}
                                disabled={!ready || dismissedIds.length === 0}
                                aria-label="Restore all news"
                            >
                                <RefreshCwIcon className="size-3.5" aria-hidden />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Show all dismissed news</TooltipContent>
                    </Tooltip>
                </HomeSectionHeading>
                {visibleItems.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-3">
                        {visibleItems.map((item) => (
                            <HomeNewsCard key={item.id} item={item} onDismiss={dismiss} />
                        ))}
                    </div>
                ) : null}
            </section>
        </TooltipProvider>
    )
}
