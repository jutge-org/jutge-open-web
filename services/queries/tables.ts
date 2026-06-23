import { type Compiler, type JutgeApiClient, type Verdict } from '@/lib/jutge_api_client'

export async function fetchCompilers(client: JutgeApiClient): Promise<Compiler[]> {
    try {
        const compilers = await client.tables.getCompilers()
        return Object.values(compilers).sort((a, b) => a.compiler_id.localeCompare(b.compiler_id))
    } catch {
        return []
    }
}

export async function fetchVerdicts(client: JutgeApiClient): Promise<Verdict[]> {
    try {
        const verdicts = await client.tables.getVerdicts()
        return Object.values(verdicts).sort((a, b) => a.verdict_id.localeCompare(b.verdict_id))
    } catch {
        return []
    }
}
