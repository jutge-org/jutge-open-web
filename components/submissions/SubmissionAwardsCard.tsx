import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AwardRow } from '@/lib/awards'

type SubmissionAwardsCardProps = {
    awards: AwardRow[]
}

export function SubmissionAwardsCard({ awards }: SubmissionAwardsCardProps) {
    return (
        <Card className="gap-0 pt-2 pb-0 ring-0 border border-border shadow-sm">
            <CardHeader className="border-b border-border px-4 py-2">
                <CardTitle className="text-lg font-semibold">Awards</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-4">
                <div className="flex flex-wrap items-center gap-8">
                    {awards.map((award) => (
                        <Link
                            key={award.award_id}
                            href={`/awards/${encodeURIComponent(award.award_id)}`}
                            aria-label={award.title}
                            className="group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <div className="bg-white p-0.5 shadow-md transition-[box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg dark:rounded-full">
                                <img
                                    src={award.iconUrl}
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
