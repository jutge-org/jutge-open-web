import { CourseLists } from '@/components/courses/CourseLists'
import { SupervisionStudentProfileCard } from '@/components/supervision/SupervisionStudentProfileCard'
import type { SupervisionStudentPageData } from '@/services/queries/supervision'

type SupervisionStudentViewProps = {
    data: SupervisionStudentPageData
}

export function SupervisionStudentView({ data }: SupervisionStudentViewProps) {
    return (
        <div className="flex flex-col gap-6">
            <SupervisionStudentProfileCard profile={data.profile} />
            <CourseLists
                courseKey={data.courseKey}
                lists={data.lists}
                languages={data.languages}
                statuses={data.statuses}
            />
        </div>
    )
}
