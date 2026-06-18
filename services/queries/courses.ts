import { cache } from 'react'

import { buildCourseRow, sortCourseRows, type CoursesData } from '@/lib/courses'
import type { JutgeApiClient } from '@/lib/jutge_api_client'

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
