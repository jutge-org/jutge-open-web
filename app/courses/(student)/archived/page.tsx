import { CoursesTabPage } from '@/components/courses/CoursesStudentShell'

export const metadata = { title: 'Archived courses — Jutge.org' }

export default function ArchivedCoursesPage() {
    return <CoursesTabPage activeTab="archived" />
}
