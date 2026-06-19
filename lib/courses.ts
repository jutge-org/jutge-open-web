import type { BriefCourse, PublicCourse } from '@/lib/jutge_api_client'

export type CourseStatus = 'enrolled' | 'available'

export type CourseRow = {
    course_key: string
    title: string
    description: string
    annotation: string
    isOfficial: boolean
    isPublic: boolean
    status: CourseStatus
}

export type CoursesData = {
    enrolled: CourseRow[]
    available: CourseRow[]
}

export type GuestCourseRow = {
    course_key: string
    title: string
    description: string
    ownerName: string
    isOfficial: boolean
    isPublic: boolean
}

function displayText(value: string | null): string {
    return value?.trim() ?? ''
}

export function buildCourseRow(course: BriefCourse, status: CourseStatus): CourseRow {
    return {
        course_key: course.course_nm,
        title: displayText(course.title) || course.course_nm,
        description: displayText(course.description),
        annotation: displayText(course.annotation),
        isOfficial: course.official !== 0,
        isPublic: course.public !== 0,
        status,
    }
}

export function sortCourseRows(rows: CourseRow[]): CourseRow[] {
    return [...rows].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
}

export function buildGuestCourseRow(courseKey: string, course: PublicCourse): GuestCourseRow {
    return {
        course_key: courseKey,
        title: displayText(course.title) || course.course_nm,
        description: displayText(course.description),
        ownerName: displayText(course.owner.name) || displayText(course.owner.username) || course.owner.email,
        isOfficial: course.official !== 0,
        isPublic: course.public !== 0,
    }
}

export function sortGuestCourseRows(rows: GuestCourseRow[]): GuestCourseRow[] {
    return [...rows].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
}
