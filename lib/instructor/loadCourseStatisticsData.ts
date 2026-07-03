import {
    fetchAllAbstractProblems,
    fetchInstructorCourse,
    fetchInstructorCourseStudentProfiles,
    fetchInstructorCourseSubmissions,
    fetchMiscHexColors,
} from '@/actions/instructor'
import { getCurrentClient } from '@/lib/auth'
import { buildHeatmapSourceData, type HeatmapSourceData } from '@/lib/instructor/courseHeatmapSourceData'
import { fetchInstructorListsMany } from '@/services/queries/lists'
import type { Dict } from '@/lib/instructor/utils'
import type {
    AbstractProblem,
    ColorMapping,
    CourseSubmission,
    InstructorCourse,
    InstructorList,
    StudentProfile,
} from '@/lib/jutge_api_client'

export type CourseStatisticsPageData = {
    submissions: CourseSubmission[]
    colors: ColorMapping
    course: InstructorCourse
    profiles: Dict<StudentProfile>
    lists: InstructorList[]
    abstractProblems: Dict<AbstractProblem>
    heatmap: HeatmapSourceData
}

export async function loadCourseStatisticsData(course_nm: string): Promise<CourseStatisticsPageData> {
    const [client, course] = await Promise.all([getCurrentClient(), fetchInstructorCourse(course_nm)])
    const [profiles, submissions, abstractProblems, colors, lists] = await Promise.all([
        fetchInstructorCourseStudentProfiles(course_nm),
        fetchInstructorCourseSubmissions(course_nm),
        fetchAllAbstractProblems(),
        fetchMiscHexColors(),
        fetchInstructorListsMany(client, course.lists),
    ])
    const heatmap = buildHeatmapSourceData(course, profiles, submissions, lists, abstractProblems)

    return { course, profiles, submissions, colors, lists, abstractProblems, heatmap }
}
