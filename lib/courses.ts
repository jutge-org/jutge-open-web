import type { BriefCourse, PublicCourse, PublicProfile } from '@/lib/jutge_api_client'

export type CourseStatus = 'enrolled' | 'available' | 'archived'

export type CourseRow = {
    course_key: string
    title: string
    description: string
    annotation: string
    ownerName: string
    isOfficial: boolean
    isPublic: boolean
    status: CourseStatus
}

export type CoursesData = {
    enrolled: CourseRow[]
    available: CourseRow[]
    archived: CourseRow[]
}

export type CoursesTab = 'enrolled' | 'available' | 'archived'

export const coursesNavItems: { tab: CoursesTab; label: string; href: string }[] = [
    { tab: 'enrolled', label: 'Enrolled', href: '/courses/enrolled' },
    { tab: 'archived', label: 'Archived', href: '/courses/archived' },
    { tab: 'available', label: 'Available', href: '/courses/available' },
]

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

function ownerDisplayName(owner: PublicProfile): string {
    return displayText(owner.name) || displayText(owner.username) || owner.email
}

export function buildCourseKey(owner: PublicProfile, course_nm: string): string {
    return `${displayText(owner.username)}:${course_nm}`
}

export function buildCourseRow(course: BriefCourse, status: CourseStatus): CourseRow {
    return {
        course_key: buildCourseKey(course.owner, course.course_nm),
        title: displayText(course.title) || course.course_nm,
        description: displayText(course.description),
        annotation: displayText(course.annotation),
        ownerName: ownerDisplayName(course.owner),
        isOfficial: course.official !== 0,
        isPublic: course.public !== 0,
        status,
    }
}

export function sortCourseRows(rows: CourseRow[]): CourseRow[] {
    return [...rows].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
}

export function buildGuestCourseRow(course: PublicCourse): GuestCourseRow {
    return {
        course_key: buildCourseKey(course.owner, course.course_nm),
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
