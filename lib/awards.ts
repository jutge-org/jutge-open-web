import type { Award, BriefAward, Submission } from '@/lib/jutge_api_client'
import { parseSubmissionTime } from '@/lib/submissions'

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

export type AwardDetail = AwardRow & {
    submission: Submission | null
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
        iconUrl: "https://jutge.org/awards/" + award.icon + ".png",
        timeMs: time.getTime(),
        timeLabel: time.toLocaleString(),
        youtube: award.youtube,
    }
}

export function buildAwardDetail(award: Award): AwardDetail {
    return {
        ...buildAwardRow(award.award_id, award),
        submission: award.submission,
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
