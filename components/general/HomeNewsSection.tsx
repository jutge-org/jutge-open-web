import { ExternalLink, OpensInNewWindow } from '@/components/ExternalLink'
import Image from 'next/image'

import { HomeSectionHeading } from '@/components/general/HomeSectionHeading'
import { cn } from '@/lib/utils'

const newsLinkClassName = 'text-primary underline-offset-4 hover:underline'

function HomeNewsCard({
    title,
    imageSrc,
    imageHref,
    children,
}: {
    title: string
    imageSrc: string
    imageHref: string
    children: React.ReactNode
}) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/40 px-4 py-3">
                <h3 className="text-sm font-semibold leading-snug text-foreground">{title}</h3>
            </div>
            <div className="flex flex-1 gap-5 p-4">
                <a
                    href={imageHref}
                    target={imageHref.startsWith('http') ? '_blank' : undefined}
                    rel={imageHref.startsWith('http') ? 'noreferrer' : undefined}
                    className="shrink-0"
                >
                    <Image src={imageSrc} alt="" width={80} height={80} className="size-22 rounded-md object-contain" />
                    {imageHref.startsWith('http') ? <OpensInNewWindow /> : null}
                </a>
                <div className={cn('flex min-w-0 flex-1 flex-col gap-2 text-sm leading-relaxed text-muted-foreground')}>
                    {children}
                </div>
            </div>
        </article>
    )
}

function QuizzesNewsItem() {
    return (
        <HomeNewsCard
            title="Quizzes by Jutge.org"
            imageSrc="/news/quizzes-jutge.png"
            imageHref="https://quizzes.jutge.org"
        >
            <p>
                Try{' '}
                <ExternalLink href="https://quizzes.jutge.org" className={newsLinkClassName}>
                    quizzes.jutge.org
                </ExternalLink>
                : Play and learn, share your knowledge, wrong answers welcome!
            </p>
            <p>
                Quizzes is currently under development. We appreciate your{' '}
                <ExternalLink href="https://feedback-quizzes.jutge.org" className={newsLinkClassName}>
                    feedback
                </ExternalLink>
                .
            </p>
        </HomeNewsCard>
    )
}

function VscodeNewsItem() {
    return (
        <HomeNewsCard
            title="VSCode extension"
            imageSrc="/news/vscode-jutge.png"
            imageHref="vscode:extension/jutge-org.jutge-vscode"
        >
            <p>
                Try the new{' '}
                <a href="vscode:extension/jutge-org.jutge-vscode" className={newsLinkClassName}>
                    Jutge VSCode Extension
                </a>{' '}
                to solve Jutge.org problems directly within your favorite IDE.
            </p>
            <p>
                Do you wish to contribute? See the{' '}
                <ExternalLink href="https://github.com/jutge-org/jutge-vscode" className={newsLinkClassName}>
                    repository
                </ExternalLink>
                .
            </p>
        </HomeNewsCard>
    )
}

function ApiNewsItem() {
    return (
        <HomeNewsCard title="API for Jutge.org" imageSrc="/news/api-jutge.png" imageHref="https://api.jutge.org">
            <p className="text-lg font-medium leading-snug">
                <ExternalLink href="https://api.jutge.org" className={newsLinkClassName}>
                    api.jutge.org
                </ExternalLink>
            </p>
            <p>
                Write programs to interact with Jutge.org: obtain information, test AIs, configure things
                automatically...
            </p>
        </HomeNewsCard>
    )
}

function LliconsNewsItem() {
    return (
        <HomeNewsCard title="Lliçons" imageSrc="/news/llicons.png" imageHref="https://lliçons.jutge.org">
            <p className="text-lg font-medium leading-snug">
                <ExternalLink href="https://lliçons.jutge.org" className={newsLinkClassName}>
                    lliçons.jutge.org
                </ExternalLink>
            </p>
            <p>El recull de lliçons d&apos;algorísmia i programació de Jutge.org.</p>
        </HomeNewsCard>
    )
}

export function HomeNewsSection() {
    return (
        <section aria-label="News" className="flex flex-col gap-4">
            <HomeSectionHeading>
                <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">News</h2>
            </HomeSectionHeading>
            <div className="grid gap-4 lg:grid-cols-3">
                <QuizzesNewsItem />
                <VscodeNewsItem />
                <ApiNewsItem />
                <LliconsNewsItem />
            </div>
        </section>
    )
}
