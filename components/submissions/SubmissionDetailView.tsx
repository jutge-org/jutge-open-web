import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from 'lucide-react'

import { SubmissionAnalysisCard } from '@/components/submissions/SubmissionAnalysisCard'
import { SubmissionCodeMetricsCard } from '@/components/submissions/SubmissionCodeMetricsCard'
import { SubmissionNavButton } from '@/components/submissions/SubmissionNavButton'
import { SubmissionSourceCodeCard } from '@/components/submissions/SubmissionSourceCodeCard'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { parseSubmissionTime, type SubmissionNavLinks } from '@/lib/submissions'
import { cn } from '@/lib/utils'
import type { SubmissionDetailData } from '@/services/queries/submissions'
import type { ReactNode } from 'react'

dayjs.extend(relativeTime)

type SubmissionDetailViewProps = {
    data: SubmissionDetailData
    codeHref: string
    problemKey: string
    navigation?: SubmissionNavLinks | null
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid gap-1 border-b border-border py-2 last:border-b-0 sm:grid-cols-[8rem_1fr] sm:gap-3">
            <dt className="text-sm font-medium text-foreground">{label}</dt>
            <dd className="text-sm text-muted-foreground">{children}</dd>
        </div>
    )
}

export function SubmissionDetailView({ data, codeHref, problemKey, navigation }: SubmissionDetailViewProps) {
    const { submission } = data
    const isPending = submission.state !== 'done'
    const submittedAt = dayjs(parseSubmissionTime(submission.time_in))
    const submittedAtLabel = `${submittedAt.isSame(dayjs(), 'day') ? submittedAt.format('HH:mm:ss') : submittedAt.format('YYYY-MM-DD HH:mm:ss')} (${submittedAt.fromNow()})`

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-6">
                <Card className="ring-0 border border-border shadow-sm">
                    <CardHeader className="border-b border-border">
                        <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                            {data.verdictEmoji ? (
                                <span aria-hidden className={cn('text-xl', isPending && 'animate-pulse')}>
                                    {data.verdictEmoji}
                                </span>
                            ) : null}
                            <span>{data.submission.submission_id}</span>
                        </CardTitle>
                        {navigation ? (
                            <CardAction>
                                <ButtonGroup>
                                    <SubmissionNavButton href={navigation.previousHref} label="Previous submission">
                                        <ChevronLeftIcon />
                                    </SubmissionNavButton>
                                    <SubmissionNavButton href={navigation.nextHref} label="Next submission">
                                        <ChevronRightIcon />
                                    </SubmissionNavButton>
                                    <SubmissionNavButton href={navigation.lastHref} label="Last submission">
                                        <ChevronsRightIcon />
                                    </SubmissionNavButton>
                                </ButtonGroup>
                            </CardAction>
                        ) : null}
                    </CardHeader>
                    <CardContent className="px-6 py-0">
                        <dl>
                            <DetailRow label="Verdict">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1.5',
                                                isPending && 'animate-pulse',
                                            )}
                                        >
                                            {data.verdictEmoji ? <span aria-hidden>{data.verdictEmoji}</span> : null}
                                            {data.verdict}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">{data.verdictFullName}</TooltipContent>
                                </Tooltip>
                            </DetailRow>
                            <DetailRow label="Compiler">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>{submission.compiler_id}</span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">{data.compilerFullName}</TooltipContent>
                                </Tooltip>
                            </DetailRow>
                            <DetailRow label="Submitted">{submittedAtLabel}</DetailRow>
                            {submission.annotation ? (
                                <DetailRow label="Annotation">{submission.annotation}</DetailRow>
                            ) : null}
                            {submission.veredict_info ? (
                                <DetailRow label="Verdict info">{submission.veredict_info}</DetailRow>
                            ) : null}
                            {submission.ok_publics_but_wrong > 0 ? (
                                <DetailRow label="Public failures">
                                    {submission.ok_publics_but_wrong} public test case
                                    {submission.ok_publics_but_wrong === 1 ? '' : 's'} failed
                                </DetailRow>
                            ) : null}
                        </dl>
                    </CardContent>
                </Card>

                {data.analysis.length > 0 ? (
                    <SubmissionAnalysisCard
                        analysis={data.analysis}
                        problemKey={problemKey}
                        submissionId={submission.submission_id}
                    />
                ) : null}

                {data.codeMetrics ? <SubmissionCodeMetricsCard data={data.codeMetrics} /> : null}

                {data.code && data.codeFilename ? (
                    <>
                        <SubmissionSourceCodeCard
                            code={data.code}
                            codeExtension={data.codeExtension}
                            codeFilename={data.codeFilename}
                            codeHref={codeHref}
                        />
                    </>
                ) : null}
            </div>
        </TooltipProvider>
    )
}
