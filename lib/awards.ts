import { parseProblemKey } from '@/lib/problems'
import type { AllTables, Award, BriefAward, Submission } from '@/lib/jutge_api_client'
import { buildSubmissionHref, formatSubmissionTime, parseSubmissionTime, submissionVerdict } from '@/lib/submissions'

export type AwardRow = {
    award_id: string
    title: string
    info: string
    type: string
    iconUrl: string
    timeMs: number
    timeLabel: string
    youtube: string | null
}

export type AwardSubmissionDetail = {
    submission_id: string
    submissionHref: string
    problemTitle: string
    problemHref: string | null
    verdict: string
    verdictFullName: string
    verdictEmoji?: string
    isPending: boolean
    timeMs: number
    timeFormatted: string
}

export type AwardDetail = AwardRow & {
    submission: AwardSubmissionDetail | null
}

export function buildAwardSubmissionDetail(submission: Submission, tables: AllTables): AwardSubmissionDetail {
    const problem = parseProblemKey(submission.problem_id)
    const problemHref =
        problem?.kind === 'problem_id' ? `/problems/${problem.problem_nm}` : `/problems/${submission.problem_id}`
    const problemLabel = problem?.kind === 'problem_id' ? problem.problem_nm : submission.problem_id
    const verdict = submissionVerdict(submission)
    const verdictMeta = tables.verdicts[verdict]

    return {
        submission_id: submission.submission_id,
        submissionHref: buildSubmissionHref(submission.problem_id, submission.submission_id),
        problemTitle: problemLabel ?? submission.problem_id,
        problemHref,
        verdict,
        verdictFullName: verdictMeta?.name ?? verdict,
        verdictEmoji: verdictMeta?.emoji,
        isPending: submission.state !== 'done',
        timeMs: parseSubmissionTime(submission.time_in).getTime(),
        timeFormatted: formatSubmissionTime(submission.time_in),
    }
}

export type AwardTypeSummary = {
    type: string
    title: string
    count: number
    items: Pick<AwardRow, 'award_id' | 'iconUrl' | 'title'>[]
}

export function buildAwardRow(award_id: string, award: BriefAward): AwardRow {
    const time = parseSubmissionTime(award.time)

    return {
        award_id,
        title: award.title,
        info: award.info,
        type: award.type,
        iconUrl: 'https://jutge.org/awards/' + award.icon + '.png',
        timeMs: time.getTime(),
        timeLabel: time.toLocaleString(),
        youtube: award.youtube,
    }
}

export function buildAwardDetail(award: Award, tables: AllTables): AwardDetail {
    return {
        ...buildAwardRow(award.award_id, award),
        submission: award.submission ? buildAwardSubmissionDetail(award.submission, tables) : null,
    }
}

export function formatAwardTypeTitle(type: string): string {
    return type
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export function sortAwardRows(rows: AwardRow[]): AwardRow[] {
    return [...rows].sort((a, b) => b.timeMs - a.timeMs)
}

export function groupAwardsByType(rows: AwardRow[]): AwardTypeSummary[] {
    const byType = new Map<string, AwardRow[]>()

    for (const row of rows) {
        const key = row.type || row.award_id
        const group = byType.get(key)
        if (group) {
            group.push(row)
        } else {
            byType.set(key, [row])
        }
    }

    return [...byType.values()]
        .map((group) => {
            const sorted = sortAwardRows(group)
            const latest = sorted[0]!

            return {
                type: latest.type,
                title: latest.title,
                count: sorted.length,
                items: sorted.map(({ award_id, iconUrl, title }) => ({
                    award_id,
                    iconUrl,
                    title,
                })),
            }
        })
        .sort((a, b) => a.type.localeCompare(b.type, undefined, { sensitivity: 'base' }))
}
