import { withSupervisorClient } from '@/lib/supervisor/client'
import type { SupervisionStudentOption } from '@/lib/supervision'

export async function fetchSupervisionCourseStudents(courseKey: string): Promise<SupervisionStudentOption[]> {
    if (!courseKey.trim()) {
        return []
    }

    const students = await withSupervisorClient((client) => client.tutor.courses.getEnrolledStudents(courseKey))

    return [...students].sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        return nameCompare !== 0 ? nameCompare : a.email.localeCompare(b.email, undefined, { sensitivity: 'base' })
    })
}
