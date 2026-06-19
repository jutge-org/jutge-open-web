import { cache } from 'react'
import { unstable_cache } from 'next/cache'

import {
    buildCourseKey,
    buildCourseRow,
    buildGuestCourseRow,
    sortCourseRows,
    sortGuestCourseRows,
    type CoursesData,
    type GuestCourseRow,
} from '@/lib/courses'
import { JutgeApiClient } from '@/lib/jutge_api_client'

const PUBLIC_COURSES_CACHE_SECONDS = 300

export const fetchCoursesData = cache(async (client: JutgeApiClient): Promise<CoursesData> => {
    const [enrolledMap, availableMap, archivedKeys] = await Promise.all([
        client.student.courses.indexEnrolled(),
        client.student.courses.indexAvailable(),
        client.student.courses.getArchivedKeys(),
    ])

    const archivedKeySet = new Set(archivedKeys)
    const enrolledRows: ReturnType<typeof buildCourseRow>[] = []
    const archivedRows: ReturnType<typeof buildCourseRow>[] = []

    for (const course of Object.values(enrolledMap)) {
        const courseKey = buildCourseKey(course.owner, course.course_nm)
        const row = buildCourseRow(course, archivedKeySet.has(courseKey) ? 'archived' : 'enrolled')
        if (archivedKeySet.has(courseKey)) {
            archivedRows.push(row)
        } else {
            enrolledRows.push(row)
        }
    }

    const enrolled = sortCourseRows(enrolledRows)
    const archived = sortCourseRows(archivedRows)
    const available = sortCourseRows(
        Object.values(availableMap).map((course) => buildCourseRow(course, 'available')),
    )

    return { enrolled, available, archived }
})

async function loadPublicCourses(): Promise<GuestCourseRow[]> {
    try {
        const client = new JutgeApiClient()
        const courses = await client.courses.indexPublic()
        return sortGuestCourseRows(Object.values(courses).map((course) => buildGuestCourseRow(course)))
    } catch {
        return []
    }
}

export const fetchPublicCourses = unstable_cache(loadPublicCourses, ['public-courses'], {
    revalidate: PUBLIC_COURSES_CACHE_SECONDS,
})
