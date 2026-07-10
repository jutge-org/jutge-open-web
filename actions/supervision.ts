'use server'

import { courseNmFromKey } from '@/lib/courses'
import { withSupervisorClient } from '@/lib/supervisor/with-supervisor-client'
import type { SupervisionStudentOption } from '@/lib/supervision'

export async function fetchSupervisionCourseStudents(courseKey: string): Promise<SupervisionStudentOption[]> {
    const course_nm = courseNmFromKey(courseKey)
    if (!course_nm) {
        return []
    }

    const [course, profiles] = await withSupervisorClient((client) =>
        Promise.all([
            client.instructor.courses.get(course_nm),
            client.instructor.courses.getStudentProfiles(course_nm),
        ]),
    )

    return course.students.enrolled
        .map((email) => ({
            email,
            name: profiles[email]?.name?.trim() ?? '',
        }))
        .sort((a, b) => {
            const nameCompare = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
            return nameCompare !== 0 ? nameCompare : a.email.localeCompare(b.email, undefined, { sensitivity: 'base' })
        })
}
