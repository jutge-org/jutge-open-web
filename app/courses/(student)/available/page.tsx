import { CoursesTabPage } from '@/components/courses/CoursesStudentShell'

export const metadata = { title: 'Available courses — Jutge.org' }

export default function AvailableCoursesPage() {
    return <CoursesTabPage activeTab="available" />
}
