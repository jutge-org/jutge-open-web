import jutge from '@/lib/jutge'
import { type Compiler, type Country, type Verdict } from '@/lib/jutge_api_client'

export async function fetchCountries(): Promise<Country[]> {
    try {
        const client = jutge
        const countries = await client.tables.getCountries()
        return Object.values(countries).sort((a, b) => a.eng_name.localeCompare(b.eng_name))
    } catch {
        return []
    }
}

export async function fetchCompilers(): Promise<Compiler[]> {
    try {
        const client = jutge
        const compilers = await client.tables.getCompilers()
        return Object.values(compilers).sort((a, b) => a.compiler_id.localeCompare(b.compiler_id))
    } catch {
        return []
    }
}

export async function fetchVerdicts(): Promise<Verdict[]> {
    try {
        const client = jutge
        const verdicts = await client.tables.getVerdicts()
        return Object.values(verdicts).sort((a, b) => a.verdict_id.localeCompare(b.verdict_id))
    } catch {
        return []
    }
}
