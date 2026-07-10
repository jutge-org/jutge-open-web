import { UserIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import type { PublicProfile } from '@/lib/jutge_api_client'

type SupervisionStudentProfileCardProps = {
    profile: PublicProfile
}

function formatOptional(value: string | null | undefined): string {
    const trimmed = value?.trim()
    return trimmed ? trimmed : '—'
}

export function SupervisionStudentProfileCard({ profile }: SupervisionStudentProfileCardProps) {
    return (
        <Card className="border border-border shadow-sm ring-0">
            <CardContent className="flex items-start gap-4 pt-6">
                <div
                    className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                    aria-hidden
                >
                    <UserIcon className="size-10" />
                </div>
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {formatOptional(profile.name)}
                    </h1>
                    <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd className="min-w-0 break-all">{profile.email}</dd>
                        </div>
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                            <dt className="text-muted-foreground">Username</dt>
                            <dd>{formatOptional(profile.username)}</dd>
                        </div>
                    </dl>
                </div>
            </CardContent>
        </Card>
    )
}
