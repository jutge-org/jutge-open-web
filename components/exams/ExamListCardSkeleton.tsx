import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ExamListCardSkeleton() {
    return (
        <Card className="border border-border border-l-4 border-l-border shadow-sm ring-0">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:gap-6">
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <Skeleton className="size-16 shrink-0 rounded-sm" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-6 w-full max-w-md" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                        </div>
                        <Skeleton className="size-9 shrink-0 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
                <div className="min-w-0 space-y-2 md:w-2/5 md:border-l md:border-border md:pl-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                </div>
            </CardContent>
        </Card>
    )
}
