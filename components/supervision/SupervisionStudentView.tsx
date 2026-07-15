import { CourseListsLoading } from '@/components/courses/CourseDetail'
import { CourseLists } from '@/components/courses/CourseLists'
import { SupervisionStudentProfileCard } from '@/components/supervision/SupervisionStudentProfileCard'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SupervisionStudentPageData } from '@/lib/data/supervision'

type SupervisionStudentViewProps = {
    data: SupervisionStudentPageData
}

function SupervisionStudentProfileCardLoading() {
    return (
        <Card className="border border-border shadow-sm ring-0" aria-busy="true" aria-label="Loading student profile">
            <CardContent className="flex items-start gap-4 pt-6">
                <Skeleton className="size-24 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </CardContent>
        </Card>
    )
}

export function SupervisionStudentViewLoading() {
    return (
        <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading supervision data">
            <SupervisionStudentProfileCardLoading />
            <CourseListsLoading count={2} />
        </div>
    )
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
                lastSubmissions={data.lastSubmissions}
                supervisionContext={data.supervisionContext}
            />
        </div>
    )
}
