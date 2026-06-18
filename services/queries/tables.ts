import { cache } from 'react'

import { JutgeApiClient, type Compiler, type Verdict } from '@/lib/jutge_api_client'

export const fetchCompilers = cache(async (): Promise<Compiler[]> => {
    try {
        const client = new JutgeApiClient()
        const compilers = await client.tables.getCompilers()
        return Object.values(compilers).sort((a, b) => a.compiler_id.localeCompare(b.compiler_id))
    } catch {
        return []
    }
})

export const fetchVerdicts = cache(async (): Promise<Verdict[]> => {
    try {
        const client = new JutgeApiClient()
        const verdicts = await client.tables.getVerdicts()
        return Object.values(verdicts).sort((a, b) => a.verdict_id.localeCompare(b.verdict_id))
    } catch {
        return []
    }
})
