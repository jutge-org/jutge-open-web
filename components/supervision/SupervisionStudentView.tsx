import { CourseListsLoading } from '@/components/courses/CourseDetail'
import { CourseLists } from '@/components/courses/CourseLists'
import type { SupervisionStudentPageData } from '@/lib/data/supervision'

type SupervisionStudentViewProps = {
    data: SupervisionStudentPageData
}

export function SupervisionStudentViewLoading() {
    return (
        <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading supervision data">
            <CourseListsLoading count={2} />
        </div>
    )
}

export function SupervisionStudentView({ data }: SupervisionStudentViewProps) {
    return (
        <div className="flex flex-col gap-6">
            <CourseLists
                courseKey={data.courseKey}
                lists={data.lists}
                languages={data.languages}
                statuses={data.statuses}
                lastSubmissions={data.lastSubmissions}
                supervisionContext={data.supervisionContext}
            />
        </div>
    )
}
