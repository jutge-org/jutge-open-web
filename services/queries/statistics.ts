import type { JutgeApiClient } from '@/lib/jutge_api_client'
import type { AllTables, ColorMapping, Dashboard, Submission } from '@/lib/jutge_api_client'

export type StatisticsData = {
    dashboard: Dashboard
    level: string
    tables: AllTables
    hexColors: ColorMapping
    submissions: Submission[]
}

export async function fetchStatisticsData(client: JutgeApiClient): Promise<StatisticsData> {
    const [dashboard, level, tables, hexColors, submissions] = await Promise.all([
        client.student.dashboard.getDashboard(),
        client.student.dashboard.getLevel(),
        client.tables.get(),
        client.misc.getHexColors(),
        client.student.submissions.getAll(),
    ])

    return { dashboard, level, tables, hexColors, submissions }
}
