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

export async function fetchAwardsData(client: JutgeApiClient): Promise<AwardRow[]> {
    const awardsMap = await client.student.awards.getAll()

    return sortAwardRows(Object.entries(awardsMap).map(([award_id, award]) => buildAwardRow(award_id, award)))
}

export async function fetchAwardsByType(client: JutgeApiClient): Promise<AwardTypeSummary[]> {
    const awards = await fetchAwardsData(client)
    return groupAwardsByType(awards)
}

export async function fetchAwardDetail(client: JutgeApiClient, award_id: string): Promise<AwardDetail | null> {
    try {
        const award = await client.student.awards.get(award_id)
        return buildAwardDetail(award)
    } catch {
        return null
    }
}
