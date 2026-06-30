'use server'

import { withAdminClient } from '@/lib/administrator/with-admin-client'

export async function fetchAdminDashboardAll() {
    return withAdminClient((c) => c.admin.dashboard.getAll())
}

export async function fetchAdminDashboardZombies() {
    return withAdminClient((c) => c.admin.dashboard.getZombies())
}

export async function fetchHomepageStats() {
    return withAdminClient((c) => c.misc.getHomepageStats())
}

export async function fetchAdminDashboardDatabasesInfo() {
    return withAdminClient((c) => c.admin.dashboard.getDatabasesInfo())
}

export async function fetchAdminDashboardFreeDiskSpace() {
    return withAdminClient((c) => c.admin.dashboard.getFreeDiskSpace())
}

export async function fetchAdminDashboardRecentConnectedUsers() {
    return withAdminClient((c) => c.admin.dashboard.getRecentConnectedUsers())
}

export async function fetchAdminDashboardRecentLoadAverages() {
    return withAdminClient((c) => c.admin.dashboard.getRecentLoadAverages())
}

export async function fetchAdminDashboardRecentSubmissions() {
    return withAdminClient((c) => c.admin.dashboard.getRecentSubmissions())
}

export async function fetchAdminDashboardSubmissionsHistograms() {
    return withAdminClient((c) => c.admin.dashboard.getSubmissionsHistograms())
}

export async function fetchAdminDashboardUpcomingExams(data: { daysBefore: number; daysAfter: number }) {
    return withAdminClient((c) => c.admin.dashboard.getUpcomingExams(data))
}

export async function fetchAdminDashboardPM2Status() {
    return withAdminClient((c) => c.admin.dashboard.getPM2Status())
}

export async function fetchAdminDashboardDockerStatus() {
    return withAdminClient((c) => c.admin.dashboard.getDockerStatus())
}

export async function fetchAdminQueue(data: { verdicts: string[]; limit: number }) {
    return withAdminClient((c) => c.admin.queue.getQueue(data))
}

export async function fetchTablesVerdicts() {
    return withAdminClient((c) => c.tables.getVerdicts())
}

export async function fetchTablesCompilers() {
    return withAdminClient((c) => c.tables.getCompilers())
}

export async function adminResubmitIEs() {
    return withAdminClient((c) => c.admin.tasks.resubmitIEs())
}

export async function adminResubmitPendings() {
    return withAdminClient((c) => c.admin.tasks.resubmitPendings())
}

export async function adminFatalizeIEs() {
    return withAdminClient((c) => c.admin.tasks.fatalizeIEs())
}

export async function adminFatalizePendings() {
    return withAdminClient((c) => c.admin.tasks.fatalizePendings())
}

export async function fetchAdminCourses() {
    return withAdminClient((c) => c.admin.courses.getAll())
}

export async function adminSetCoursePublicAndOfficial(data: {
    course_id: string
    public: number
    official: number
}) {
    return withAdminClient((c) => c.admin.courses.setPublicAndOfficial(data))
}

export async function fetchAdminInstructors() {
    return withAdminClient((c) => c.admin.instructors.get())
}

export async function adminAddInstructor(data: { email: string; username: string }) {
    return withAdminClient((c) => c.admin.instructors.add(data))
}

export async function adminRemoveInstructor(email: string) {
    return withAdminClient((c) => c.admin.instructors.remove(email))
}

export async function fetchAdminUserProfiles(search: string) {
    return withAdminClient((c) => c.admin.users.getProfiles(search))
}

export async function fetchAdminSpamUsers() {
    return withAdminClient((c) => c.admin.users.getSpamUsers())
}

export async function adminRemoveSpamUsers(emails: string[]) {
    return withAdminClient((c) => c.admin.users.removeSpamUsers(emails))
}

export async function adminSetPassword(data: { email: string; password: string; message: string }) {
    return withAdminClient((c) => c.admin.users.setPassword(data))
}

export async function fetchAdminRanking(limit: number) {
    return withAdminClient((c) => c.admin.stats.getRankingOfUsers(limit))
}

export async function fetchAdminStatsCounters() {
    return withAdminClient((c) => c.admin.stats.getCounters())
}

export async function fetchAdminStatsDistributionOfCompilers() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfCompilers())
}

export async function fetchAdminStatsDistributionOfVerdicts() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfVerdicts())
}

export async function fetchAdminStatsDistributionOfProglangs() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfProglangs())
}

export async function fetchAdminStatsDistributionOfUsersByCountry() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfUsersByCountry())
}

export async function fetchAdminStatsDistributionOfSubmissionsByYear() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfSubmissionsByYear())
}

export async function fetchAdminStatsDistributionOfUsersByYear() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfUsersByYear())
}

export async function fetchAdminStatsDistributionOfSubmissionsByWeekday() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfSubmissionsByWeekday())
}

export async function fetchAdminStatsDistributionOfSubmissionsByDay() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfSubmissionsByDay())
}

export async function fetchAdminStatsDistributionOfSubmissionsByHour() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfSubmissionsByHour())
}

export async function fetchAdminStatsDistributionOfUsersBySubmissions(limit: number) {
    return withAdminClient((c) => c.admin.stats.getDistributionOfUsersBySubmissions(limit))
}

export async function fetchAdminStatsDistributionOfDomains() {
    return withAdminClient((c) => c.admin.stats.getDistributionOfDomains())
}

export async function fetchProblemPopularityBuckets() {
    return withAdminClient((c) => c.instructor.problems.getProblemPopularityBuckets())
}

export async function fetchAdminHeatmapCalendar(data: { start: string; end: string }) {
    return withAdminClient((c) => c.admin.stats.getHeatmapCalendarOfSubmissions(data))
}
