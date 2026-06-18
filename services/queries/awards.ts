import { cache } from 'react'

import {
    buildAwardDetail,
    buildAwardRow,
    groupAwardsByType,
    sortAwardRows,
    type AwardDetail,
    type AwardRow,
    type AwardTypeSummary,
} from '@/lib/awards'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

export const fetchAwardsData = cache(async (client: JutgeApiClient): Promise<AwardRow[]> => {
    const awardsMap = await client.student.awards.getAll()

    return sortAwardRows(
        Object.entries(awardsMap).map(([award_id, award]) => buildAwardRow(award_id, award)),
    )
})

export const fetchAwardsByType = cache(async (client: JutgeApiClient): Promise<AwardTypeSummary[]> => {
    const awards = await fetchAwardsData(client)
    return groupAwardsByType(awards)
})

export const fetchAwardDetail = cache(async (client: JutgeApiClient, award_id: string): Promise<AwardDetail | null> => {
    try {
        const award = await client.student.awards.get(award_id)
        return buildAwardDetail(award)
    } catch {
        return null
    }
})
