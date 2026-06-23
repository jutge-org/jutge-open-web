'use client'

import { useEffect, useState, type ReactNode } from 'react'

import { MarkdownText } from '@/components/general/MarkdownText'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { fetchProfilePageData } from '@/services/queries/users'
import { CrownIcon, GraduationCapIcon } from 'lucide-react'

function formatOptional(value: string | null | undefined): string {
    const trimmed = value?.trim()
    return trimmed ? trimmed : '—'
}

export function UserProfileView() {
    const { user, client, loading: authLoading } = useJutgeAuth()
    const [content, setContent] = useState<ReactNode | null>(null)

    useEffect(() => {
        if (authLoading || !user) return

        let cancelled = false

        void fetchProfilePageData(client).then(
            ({ profile, countries, languageName, compilerName, avatarDataUrl }) => {
                if (cancelled) return

                const country = profile.country_id
                    ? countries.find((entry) => entry.country_id === profile.country_id)
                    : null
                const countryName = country?.eng_name ?? '—'
                const description = profile.description?.trim()

                setContent(
                    <div className="flex w-full flex-col gap-6">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-3 text-sm">
                                    <ProfileField label="Name" value={formatOptional(profile.name)} />
                                    <ProfileField label="Email" value={profile.email} />
                                    <ProfileField label="Nickname" value={formatOptional(profile.nickname)} />
                                    <ProfileField label="Affiliation" value={formatOptional(profile.affiliation)} />
                                    <ProfileField label="Country" value={countryName} />
                                    <ProfileField
                                        label="Birth year"
                                        value={profile.birth_year ? String(profile.birth_year) : '—'}
                                    />
                                    <ProfileField label="Timezone" value={formatOptional(profile.timezone_id)} />
                                    <ProfileField
                                        label="Web page"
                                        value={
                                            profile.webpage?.trim() ? (
                                                <a
                                                    href={profile.webpage}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary underline-offset-4 hover:underline"
                                                >
                                                    {profile.webpage}
                                                </a>
                                            ) : (
                                                '—'
                                            )
                                        }
                                    />
                                    {languageName ? (
                                        <ProfileField label="Favorite language" value={languageName} />
                                    ) : null}
                                    {compilerName ? (
                                        <ProfileField label="Favorite compiler" value={compilerName} />
                                    ) : null}
                                    {user.instructor || user.administrator ? (
                                        <ProfileField
                                            label="Roles"
                                            value={
                                                <span className="flex flex-wrap gap-2">
                                                    {user.instructor ? (
                                                        <Badge variant="secondary">
                                                            <GraduationCapIcon aria-hidden />
                                                            Instructor
                                                        </Badge>
                                                    ) : null}
                                                    {user.administrator ? (
                                                        <Badge variant="secondary">
                                                            <CrownIcon aria-hidden />
                                                            Administrator
                                                        </Badge>
                                                    ) : null}
                                                </span>
                                            }
                                        />
                                    ) : null}
                                    <ProfileField label="User id" value={user.id} />
                                </dl>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Avatar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {avatarDataUrl ? (
                                    <div className="flex justify-center sm:justify-start">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={avatarDataUrl}
                                            alt="Avatar"
                                            className="size-32 rounded-xl object-cover"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No avatar uploaded yet.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {description ? (
                                    <MarkdownText>{description}</MarkdownText>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No description provided.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>,
                )
            },
        )

        return () => {
            cancelled = true
        }
    }, [authLoading, client, user])

    if (authLoading || !content) {
        return <p className="py-16 text-center text-muted-foreground">Loading…</p>
    }

    return content
}

function ProfileField({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="text-muted-foreground sm:min-w-32 sm:shrink-0 sm:text-right">{label}</dt>
            <dd className="wrap-break-word">{value}</dd>
        </div>
    )
}
