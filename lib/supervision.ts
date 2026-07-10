export type SupervisionCourseOption = {
    courseKey: string
    title: string
    iconUrl: string
}

export type SupervisionStudentOption = {
    email: string
    name: string
}

const SUPERVISION_COURSE_STORAGE_PREFIX = 'jutge-supervision-course:'
const SUPERVISION_STUDENT_STORAGE_PREFIX = 'jutge-supervision-student:'

export function supervisionCourseStorageKey(userId: string): string {
    return `${SUPERVISION_COURSE_STORAGE_PREFIX}${userId}`
}

export function supervisionStudentStorageKey(userId: string, courseKey: string): string {
    return `${SUPERVISION_STUDENT_STORAGE_PREFIX}${userId}:${courseKey}`
}

export function parseStoredSupervisionCourseKey(
    stored: string | null,
    availableCourseKeys: readonly string[],
): string | null {
    if (!stored?.trim()) {
        return null
    }

    const courseKey = stored.trim()
    return availableCourseKeys.includes(courseKey) ? courseKey : null
}

export function parseStoredSupervisionStudentEmail(
    stored: string | null,
    availableStudentEmails: readonly string[],
): string | null {
    if (!stored?.trim()) {
        return null
    }

    const email = stored.trim()
    return availableStudentEmails.includes(email) ? email : null
}

export function supervisionHref(courseKey: string, email: string): string {
    return `/supervision/${courseKey}/${email}`
}

export function storeSupervisionCoursePreference(userId: string, courseKey: string): void {
    localStorage.setItem(supervisionCourseStorageKey(userId), courseKey)
}
