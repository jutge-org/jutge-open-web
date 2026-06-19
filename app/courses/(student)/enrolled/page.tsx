import { CoursesTabPage } from '@/components/courses/CoursesStudentShell'

export const metadata = { title: 'Enrolled courses — Jutge.org' }

export default function EnrolledCoursesPage() {
    return <CoursesTabPage activeTab="enrolled" />
}
