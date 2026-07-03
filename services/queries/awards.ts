import { cache } from 'react'

import { getPreferredLanguageId } from '@/lib/auth'
import {
    buildAwardDetail,
    buildAwardRow,
    groupAwardsByType,
    sortAwardRows,
    type AwardDetail,
    type AwardRow,
    type AwardTypeSummary,
} from '@/lib/awards'
import { parseProblemKey } from '@/lib/problems'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

import { abstractProblemsToTitleMap } from './problems'

export const fetchAwardsData = cache(async (client: JutgeApiClient): Promise<AwardRow[]> => {
    const awardsMap = await client.student.awards.getAll()

    return sortAwardRows(Object.entries(awardsMap).map(([award_id, award]) => buildAwardRow(award_id, award)))
})

export const fetchAwardsByType = cache(async (client: JutgeApiClient): Promise<AwardTypeSummary[]> => {
    const awards = await fetchAwardsData(client)
    return groupAwardsByType(awards)
})

export const fetchAwardDetail = cache(async (client: JutgeApiClient, award_id: string): Promise<AwardDetail | null> => {
    try {
        const [award, tables] = await Promise.all([client.student.awards.get(award_id), client.tables.get()])
        const detail = buildAwardDetail(award, tables)

        if (!detail.submission || !award.submission) {
            return detail
        }

        const submission = award.submission
        const parsed = parseProblemKey(submission.problem_id)
        const problem_nm = parsed.kind === 'problem_id' ? parsed.problem_nm : submission.problem_id

        try {
            const [abstractProblems, preferredLanguageId] = await Promise.all([
                client.problems.getAbstractProblems(problem_nm),
                getPreferredLanguageId(),
            ])
            const titles = abstractProblemsToTitleMap(abstractProblems, preferredLanguageId)
            const problemTitle =
                titles.get(submission.problem_id) ?? titles.get(problem_nm) ?? detail.submission.problemTitle

            return {
                ...detail,
                submission: {
                    ...detail.submission,
                    problemTitle,
                },
            }
        } catch {
            return detail
        }
    } catch {
        return null
    }
})

export const fetchSubmissionAwards = cache(
    async (client: JutgeApiClient, problem_id: string, submission_id: string): Promise<AwardRow[]> => {
        const awardIds = await client.student.submissions
            .getAwards({ problem_id, submission_id })
            .catch(() => [] as string[])

        if (awardIds.length === 0) {
            return []
        }

        const awards = await Promise.all(
            awardIds.map(async (award_id) => {
                try {
                    const award = await client.student.awards.get(award_id)
                    return buildAwardRow(award.award_id, award)
                } catch {
                    return null
                }
            }),
        )

        return sortAwardRows(awards.filter((award): award is AwardRow => award !== null))
    },
)
