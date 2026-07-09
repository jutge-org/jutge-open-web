import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { AwardDetail } from '@/lib/awards'
import { cn } from '@/lib/utils'

dayjs.extend(relativeTime)

type AwardDetailCardProps = {
    award: AwardDetail
}

function RelativeTimeWithTooltip({ timeMs, formatted }: { timeMs: number; formatted: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span>{dayjs(timeMs).fromNow()}</span>
            </TooltipTrigger>
            <TooltipContent side="top">{formatted}</TooltipContent>
        </Tooltip>
    )
}

export function AwardDetailCard({ award }: AwardDetailCardProps) {
    const submission = award.submission

    return (
        <TooltipProvider>
            <Card className="overflow-hidden">
                <CardContent className="space-y-6 px-8 py-8">
                    <div className="gap-4 px-8 py-4 text-center flex flex-col items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={award.iconUrl}
                            alt=""
                            className="size-32 rounded-2xl border border-border bg-background object-contain p-3 sm:size-40"
                        />
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                {award.title}
                            </CardTitle>
                            <CardDescription className="font-mono text-sm">{award.award_id}</CardDescription>
                        </div>
                    </div>
                    {award.info ? (
                        <p className="text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
                            {award.info}
                        </p>
                    ) : null}
                    {award.youtube ? (
                        <div className="px-8 py-5">
                            <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-black">
                                <div className="aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${award.youtube}`}
                                        title={`${award.title} video`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="size-full rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <div className="flex flex-col items-center justify-center gap-3">
                        {award.type ? <Badge variant="secondary">{award.type}</Badge> : null}
                        <span className="text-sm text-muted-foreground">
                            Earned <RelativeTimeWithTooltip timeMs={award.timeMs} formatted={award.timeLabel} />
                        </span>
                    </div>
                    {submission ? (
                        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-muted/30 px-5 py-4 text-sm">
                            <p className="mb-2 font-medium text-foreground">Related submission</p>
                            <dl className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <dt className="text-muted-foreground">Submission</dt>
                                    <dd>
                                        <Link href={submission.submissionHref} className="text-primary hover:underline">
                                            {submission.submission_id}
                                        </Link>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Verdict</dt>
                                    <dd>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1.5',
                                                        submission.isPending && 'animate-pulse',
                                                    )}
                                                >
                                                    {submission.verdictEmoji ? (
                                                        <span aria-hidden>{submission.verdictEmoji}</span>
                                                    ) : null}
                                                    {submission.verdict}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">{submission.verdictFullName}</TooltipContent>
                                        </Tooltip>
                                    </dd>
                                </div>
                                {submission.problemHref ? (
                                    <div>
                                        <dt className="text-muted-foreground">Problem</dt>
                                        <dd>
                                            <Link
                                                href={submission.problemHref}
                                                className="text-primary hover:underline"
                                            >
                                                {submission.problemTitle}
                                            </Link>
                                        </dd>
                                    </div>
                                ) : null}
                                <div>
                                    <dt className="text-muted-foreground">Submitted</dt>
                                    <dd>
                                        <RelativeTimeWithTooltip
                                            timeMs={submission.timeMs}
                                            formatted={submission.timeFormatted}
                                        />
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
