import {
    fetchAllAbstractProblems,
    fetchInstructorCourse,
    fetchInstructorCourseStudentProfiles,
    fetchInstructorCourseSubmissions,
    fetchInstructorList,
    fetchMiscHexColors,
} from '@/actions/instructor'
import { buildHeatmapSourceData, type HeatmapSourceData } from '@/lib/instructor/courseHeatmapSourceData'
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
    const [course, profiles, submissions, abstractProblems, colors] = await Promise.all([
        fetchInstructorCourse(course_nm),
        fetchInstructorCourseStudentProfiles(course_nm),
        fetchInstructorCourseSubmissions(course_nm),
        fetchAllAbstractProblems(),
        fetchMiscHexColors(),
    ])
    const lists = await Promise.all(course.lists.map((list_nm) => fetchInstructorList(list_nm)))
    const heatmap = buildHeatmapSourceData(course, profiles, submissions, lists, abstractProblems)

    return { course, profiles, submissions, colors, lists, abstractProblems, heatmap }
}
