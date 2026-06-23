import { cache } from 'react'

import {
    buildCourseKey,
    buildCourseRow,
    buildCoursesNavItems,
    buildGuestCourseRow,
    normalizeCourseKeyParam,
    sortCourseRows,
    sortGuestCourseRows,
    type CourseStatus,
    type CoursesData,
    type CoursesNavItem,
    type GuestCourseRow,
} from '@/lib/courses'
import { getAnonymousJutgeClient } from '@/lib/jutge-client-registry'
import { JutgeApiClient, type Course } from '@/lib/jutge_api_client'

async function resolveEnrolledCourseKey(client: JutgeApiClient, courseKeyParam: string): Promise<string | null> {
    const normalized = normalizeCourseKeyParam(courseKeyParam)
    const enrolledMap = await client.student.courses.indexEnrolled()

    if (enrolledMap[normalized]) {
        return normalized
    }

    const caseMatch = Object.keys(enrolledMap).find((key) => key.toLowerCase() === normalized.toLowerCase())
    if (caseMatch) {
        return caseMatch
    }

    for (const [apiKey, course] of Object.entries(enrolledMap)) {
        if (buildCourseKey(course.owner, course.course_nm) === normalized) {
            return apiKey
        }
    }

    return null
}

async function resolveAvailableCourseKey(client: JutgeApiClient, courseKeyParam: string): Promise<string | null> {
    const normalized = normalizeCourseKeyParam(courseKeyParam)
    const availableMap = await client.student.courses.indexAvailable()

    if (availableMap[normalized]) {
        return normalized
    }

    const caseMatch = Object.keys(availableMap).find((key) => key.toLowerCase() === normalized.toLowerCase())
    if (caseMatch) {
        return caseMatch
    }

    for (const [apiKey, course] of Object.entries(availableMap)) {
        if (buildCourseKey(course.owner, course.course_nm) === normalized) {
            return apiKey
        }
    }

    return null
}

export const fetchCoursesData = cache(async (client: JutgeApiClient): Promise<CoursesData> => {
    const [enrolledMap, availableMap, archivedKeys] = await Promise.all([
        client.student.courses.indexEnrolled(),
        client.student.courses.indexAvailable(),
        client.student.courses.getArchivedKeys(),
    ])

    const archivedKeySet = new Set(archivedKeys)
    const enrolledRows: ReturnType<typeof buildCourseRow>[] = []
    const archivedRows: ReturnType<typeof buildCourseRow>[] = []

    for (const [apiKey, course] of Object.entries(enrolledMap)) {
        const row = buildCourseRow(course, archivedKeySet.has(apiKey) ? 'archived' : 'enrolled', apiKey)
        if (archivedKeySet.has(apiKey)) {
            archivedRows.push(row)
        } else {
            enrolledRows.push(row)
        }
    }

    const enrolled = sortCourseRows(enrolledRows)
    const archived = sortCourseRows(archivedRows)
    const available = sortCourseRows(
        Object.entries(availableMap).map(([apiKey, course]) => buildCourseRow(course, 'available', apiKey)),
    )

    return { enrolled, available, archived }
})

export const fetchEnrolledCoursesNavItems = cache(async (client: JutgeApiClient): Promise<CoursesNavItem[]> => {
    const data = await fetchCoursesData(client)
    return buildCoursesNavItems(data.enrolled)
})

export type FetchedCourse = {
    courseKey: string
    course: Course
    status: CourseStatus
}

export const fetchCourse = cache(
    async (client: JutgeApiClient, courseKeyParam: string): Promise<FetchedCourse | null> => {
        const enrolledKey = await resolveEnrolledCourseKey(client, courseKeyParam)
        if (enrolledKey) {
            try {
                const [course, archivedKeys] = await Promise.all([
                    client.student.courses.getEnrolled(enrolledKey),
                    client.student.courses.getArchivedKeys(),
                ])
                const status: CourseStatus = archivedKeys.includes(enrolledKey) ? 'archived' : 'enrolled'
                return { courseKey: enrolledKey, course, status }
            } catch {
                const enrolledMap = await client.student.courses.indexEnrolled()
                const brief = enrolledMap[enrolledKey]
                if (brief) {
                    const archivedKeys = await client.student.courses.getArchivedKeys()
                    const status: CourseStatus = archivedKeys.includes(enrolledKey) ? 'archived' : 'enrolled'
                    return { courseKey: enrolledKey, course: { ...brief, lists: [] }, status }
                }
            }
        }

        const availableKey = await resolveAvailableCourseKey(client, courseKeyParam)
        if (!availableKey) {
            return null
        }

        try {
            const course = await client.student.courses.getAvailable(availableKey)
            return { courseKey: availableKey, course, status: 'available' }
        } catch {
            const availableMap = await client.student.courses.indexAvailable()
            const brief = availableMap[availableKey]
            if (!brief) {
                return null
            }

            return { courseKey: availableKey, course: { ...brief, lists: [] }, status: 'available' }
        }
    },
)

async function loadPublicCourses(): Promise<GuestCourseRow[]> {
    try {
        const client = getAnonymousJutgeClient()
        const courses = await client.courses.indexPublic()
        return sortGuestCourseRows(Object.values(courses).map((course) => buildGuestCourseRow(course)))
    } catch {
        return []
    }
}

export const fetchPublicCourses = cache(loadPublicCourses)
