import {
    fetchAllAbstractProblems,
    fetchInstructorCourse,
    fetchInstructorCourseStudentProfiles,
    fetchInstructorCourseSubmissions,
    fetchMiscHexColors,
} from '@/lib/instructor/client'
import { buildHeatmapSourceData, type HeatmapSourceData } from '@/lib/instructor/courseHeatmapSourceData'
import { fetchInstructorListsMany } from '@/lib/data/lists'
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
    const course = await fetchInstructorCourse(course_nm)
    const [profiles, submissions, abstractProblems, colors, lists] = await Promise.all([
        fetchInstructorCourseStudentProfiles(course_nm),
        fetchInstructorCourseSubmissions(course_nm),
        fetchAllAbstractProblems(),
        fetchMiscHexColors(),
        fetchInstructorListsMany(course.lists),
    ])
    const heatmap = buildHeatmapSourceData(course, profiles, submissions, lists, abstractProblems)

    return { course, profiles, submissions, colors, lists, abstractProblems, heatmap }
}
