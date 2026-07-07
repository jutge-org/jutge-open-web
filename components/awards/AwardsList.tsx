import Link from 'next/link'
import { Award } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { formatAwardTypeTitle, type AwardTypeSummary } from '@/lib/awards'

type AwardsListProps = {
    awards: AwardTypeSummary[]
}

function AwardTypeCard({ award }: { award: AwardTypeSummary }) {
    const title = formatAwardTypeTitle(award.type)

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle className="text-base leading-snug">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-center gap-8">
                    {award.items.map((item) => (
                        <Link
                            key={item.award_id}
                            href={`/awards/${encodeURIComponent(item.award_id)}`}
                            aria-label={item.title}
                            className="group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <div className="bg-white p-0.5 shadow-md transition-[box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg dark:rounded-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.iconUrl}
                                    alt=""
                                    className="object-contain dark:rounded-full"
                                    height={80}
                                    width={80}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function AwardsList({ awards }: AwardsListProps) {
    if (awards.length === 0) {
        return (
            <Empty className="rounded-2xl border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Award aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>No awards yet</EmptyTitle>
                    <EmptyDescription>
                        Solve problems and complete challenges on Jutge.org to earn awards.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {awards.map((award) => (
                <AwardTypeCard key={award.type} award={award} />
            ))}
        </div>
    )
}
