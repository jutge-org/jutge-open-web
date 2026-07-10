import { cache } from 'react'

import { getAnonymousJutgeClient } from '@/lib/jutge-client-registry'
import { type Compiler, type Country, type Verdict } from '@/lib/jutge_api_client'

export const fetchCountries = cache(async (): Promise<Country[]> => {
    try {
        const client = getAnonymousJutgeClient()
        const countries = await client.tables.getCountries()
        return Object.values(countries).sort((a, b) => a.eng_name.localeCompare(b.eng_name))
    } catch {
        return []
    }
})

export const fetchCompilers = cache(async (): Promise<Compiler[]> => {
    try {
        const client = getAnonymousJutgeClient()
        const compilers = await client.tables.getCompilers()
        return Object.values(compilers).sort((a, b) => a.compiler_id.localeCompare(b.compiler_id))
    } catch {
        return []
    }
})

export const fetchVerdicts = cache(async (): Promise<Verdict[]> => {
    try {
        const client = getAnonymousJutgeClient()
        const verdicts = await client.tables.getVerdicts()
        return Object.values(verdicts).sort((a, b) => a.verdict_id.localeCompare(b.verdict_id))
    } catch {
        return []
    }
})
