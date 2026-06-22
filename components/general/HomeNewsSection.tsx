import Image from 'next/image'

import { HomeSectionHeading } from '@/components/general/HomeSectionHeading'
import { cn } from '@/lib/utils'

type HomeNewsItem = {
    id: string
    title: string
    imageSrc: string
    imageHref: string
    children: React.ReactNode
}

const newsLinkClassName = 'text-primary underline-offset-4 hover:underline'

const newsItems: HomeNewsItem[] = [
    {
        id: 'quizzes',
        title: 'Quizzes by Jutge.org',
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
        title: 'VSCode extension',
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
        title: 'API for Jutge.org',
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

function HomeNewsCard({ item }: { item: HomeNewsItem }) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/40 px-4 py-3">
                <h3 className="text-sm font-semibold leading-snug text-foreground">{item.title}</h3>
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
                        className="size-22 rounded-md object-contain"
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
    return (
        <section aria-label="News" className="flex flex-col gap-4">
            <HomeSectionHeading>
                <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">News</h2>
            </HomeSectionHeading>
            <div className="grid gap-4 lg:grid-cols-3">
                {newsItems.map((item) => (
                    <HomeNewsCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    )
}
