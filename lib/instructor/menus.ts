export type InstructorSubNavItem = {
    key: string
    label: string
    segment: string
}

export const instructorCourseSubNav = (course_nm: string): InstructorSubNavItem[] => {
    void course_nm
    return [
        { key: 'properties', label: 'Properties', segment: 'properties' },
        { key: 'students', label: 'Students', segment: 'students' },
        { key: 'tutors', label: 'Tutors', segment: 'tutors' },
        { key: 'lists', label: 'Lists', segment: 'lists' },
        { key: 'statistics', label: 'Statistics', segment: 'statistics' },
        { key: 'duplicate', label: 'Duplicate', segment: 'duplicate' },
    ]
}

export const instructorListSubNav = (list_nm: string): InstructorSubNavItem[] => {
    void list_nm
    return [
        { key: 'properties', label: 'Properties', segment: 'properties' },
        { key: 'items', label: 'Items', segment: 'items' },
        { key: 'duplicate', label: 'Duplicate', segment: 'duplicate' },
    ]
}

export const instructorExamSubNav = (exam_nm: string): InstructorSubNavItem[] => {
    void exam_nm
    return [
        { key: 'properties', label: 'Properties', segment: 'properties' },
        { key: 'problems', label: 'Problems', segment: 'problems' },
        { key: 'students', label: 'Students', segment: 'students' },
        { key: 'submissions', label: 'Submissions', segment: 'submissions' },
        { key: 'ranking', label: 'Ranking', segment: 'ranking' },
        { key: 'statistics', label: 'Statistics', segment: 'statistics' },
    ]
}

export const instructorProblemSubNav = (problem_nm: string): InstructorSubNavItem[] => {
    void problem_nm
    return [
        { key: 'properties', label: 'Properties', segment: 'properties' },
        { key: 'checking', label: 'Checking', segment: 'checking' },
        { key: 'sharing', label: 'Sharing', segment: 'sharing' },
        { key: 'statistics', label: 'Statistics', segment: 'statistics' },
        { key: 'update', label: 'Update', segment: 'update' },
        { key: 'dangerzone', label: 'Danger Zone', segment: 'dangerzone' },
    ]
}

export const instructorJutgeaiSubNav: InstructorSubNavItem[] = [
    { key: 'chat', label: 'Chat', segment: 'chat' },
    { key: 'audit', label: 'Audit', segment: 'audit' },
    { key: 'usage', label: 'Usage', segment: 'usage' },
]

export function instructorResourceHref(
    section: 'courses' | 'lists' | 'exams' | 'problems',
    resource_nm: string,
    segment: string,
): string {
    return `/instructor/${section}/${resource_nm}/${segment}`
}
