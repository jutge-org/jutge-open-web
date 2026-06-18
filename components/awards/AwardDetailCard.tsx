import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { parseProblemKey } from '@/lib/problems'
import { formatSubmissionTime, submissionVerdict } from '@/lib/submissions'
import type { AwardDetail } from '@/lib/awards'

type AwardDetailCardProps = {
    award: AwardDetail
}

export function AwardDetailCard({ award }: AwardDetailCardProps) {
    const submission = award.submission
    const problem = submission ? parseProblemKey(submission.problem_id) : null
    const problemHref =
        problem?.kind === 'problem_id'
            ? `/problems/${problem.problem_nm}`
            : submission
              ? `/problems/${submission.problem_id}`
              : null
    const problemLabel = problem?.kind === 'problem_id' ? problem.problem_nm : submission?.problem_id

    return (
        <Card className="overflow-hidden">
            <CardContent className="space-y-6 px-8 py-8">
                <div className="gap-4 px-8 py-4 text-center flex flex-col items-center">
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
                    <span className="text-sm text-muted-foreground">Earned {award.timeLabel}</span>
                </div>
                {submission ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-muted/30 px-5 py-4 text-sm">
                        <p className="mb-2 font-medium text-foreground">Related submission</p>
                        <dl className="grid gap-2 sm:grid-cols-2">
                            <div>
                                <dt className="text-muted-foreground">Submission</dt>
                                <dd className="font-mono text-xs">{submission.submission_id}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Verdict</dt>
                                <dd>{submissionVerdict(submission)}</dd>
                            </div>
                            {problemLabel && problemHref ? (
                                <div>
                                    <dt className="text-muted-foreground">Problem</dt>
                                    <dd>
                                        <Link href={problemHref} className="text-primary hover:underline">
                                            {problemLabel}
                                        </Link>
                                    </dd>
                                </div>
                            ) : null}
                            <div>
                                <dt className="text-muted-foreground">Submitted</dt>
                                <dd>{formatSubmissionTime(submission.time_in)}</dd>
                            </div>
                        </dl>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
