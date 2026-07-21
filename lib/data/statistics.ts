import { getPreferredLanguageId } from '@/lib/data/auth'
import { fetchStudentProblemStatuses } from '@/lib/data/problems'
import { buildSolvedProblems, type SolvedProblemRow } from '@/lib/statistics/data'
import type {
    AbstractProblem,
    AllTables,
    ColorMapping,
    Dashboard,
    JutgeApiClient,
    Submission,
} from '@/lib/jutge_api_client'

export type StatisticsData = {
    dashboard: Dashboard
    level: string
    tables: AllTables
    hexColors: ColorMapping
    submissions: Submission[]
    solvedProblems: SolvedProblemRow[]
}

export type DashboardOverview = {
    dashboard: Dashboard
    level: string
}

/**
 * The summary row and submission calendar only need the dashboard itself, so the home page
 * skips the submissions, tables and solved-problem lookups that fetchStatisticsData does.
 */
export async function fetchDashboardOverview(client: JutgeApiClient): Promise<DashboardOverview> {
    const [dashboard, level] = await Promise.all([
        client.student.dashboard.getDashboard(),
        client.student.dashboard.getLevel(),
    ])

    return { dashboard, level }
}

export async function fetchStatisticsData(client: JutgeApiClient): Promise<StatisticsData> {
    const [dashboard, level, tables, hexColors, submissions, statuses, preferredLanguageId] = await Promise.all([
        client.student.dashboard.getDashboard(),
        client.student.dashboard.getLevel(),
        client.tables.get(),
        client.misc.getHexColors(),
        client.student.submissions.getAll(),
        fetchStudentProblemStatuses(client),
        getPreferredLanguageId(),
    ])

    const acceptedProblemNms = Object.values(statuses)
        .filter((status) => status.status === 'accepted')
        .map((status) => status.problem_nm)

    let abstractProblems: Record<string, AbstractProblem> = {}
    if (acceptedProblemNms.length > 0) {
        try {
            abstractProblems = await client.problems.getAbstractProblems(acceptedProblemNms.join(','))
        } catch {
            // Icons and titles fall back in buildSolvedProblems.
        }
    }

    const solvedProblems = buildSolvedProblems(statuses, abstractProblems, preferredLanguageId)

    return { dashboard, level, tables, hexColors, submissions, solvedProblems }
}
