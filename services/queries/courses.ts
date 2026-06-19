import { cache } from 'react'
import { unstable_cache } from 'next/cache'

import {
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
    const [enrolledMap, availableMap] = await Promise.all([
        client.student.courses.indexEnrolled(),
        client.student.courses.indexAvailable(),
    ])

    const enrolled = sortCourseRows(
        Object.values(enrolledMap).map((course) => buildCourseRow(course, 'enrolled')),
    )
    const available = sortCourseRows(
        Object.values(availableMap).map((course) => buildCourseRow(course, 'available')),
    )

    return { enrolled, available }
})

async function loadPublicCourses(): Promise<GuestCourseRow[]> {
    try {
        const client = new JutgeApiClient()
        const courses = await client.courses.indexPublic()
        return sortGuestCourseRows(
            Object.entries(courses).map(([courseKey, course]) => buildGuestCourseRow(courseKey, course)),
        )
    } catch {
        return []
    }
}

export const fetchPublicCourses = unstable_cache(loadPublicCourses, ['public-courses'], {
    revalidate: PUBLIC_COURSES_CACHE_SECONDS,
})
