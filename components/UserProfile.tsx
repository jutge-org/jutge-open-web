import { getCurrentClient, type SessionUser } from '@/lib/auth'
import { fetchStudentAvatarDataUrl } from '@/services/queries/users'
import { Button } from '@/components/ui/button'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

function formatOptional(value: string | null | undefined): string {
    const trimmed = value?.trim()
    return trimmed ? trimmed : '—'
}

type UserProfileProps = {
    user: SessionUser
}

export async function UserProfile({ user }: UserProfileProps) {
    const client = await getCurrentClient()
    const [profile, countriesRecord, languagesRecord, compilersRecord, avatarDataUrl] = await Promise.all([
        client.student.profile.get(),
        client.tables.getCountries(),
        client.tables.getLanguages(),
        client.tables.getCompilers(),
        fetchStudentAvatarDataUrl(client),
    ])

    const countryName =
        profile.country_id && countriesRecord[profile.country_id] ? countriesRecord[profile.country_id].eng_name : '—'
    const languageName =
        profile.language_id && languagesRecord[profile.language_id]
            ? languagesRecord[profile.language_id].eng_name
            : '—'
    const compilerName =
        profile.compiler_id && compilersRecord[profile.compiler_id]
            ? compilersRecord[profile.compiler_id].name
            : '—'

    return (
        <div className="flex w-full max-w-lg flex-col gap-4">
            <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
                <div className="mb-4 flex justify-center sm:justify-start">
                    {avatarDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarDataUrl} alt="Avatar" className="rounded-xl" />
                    ) : null}
                </div>
                <dl className="space-y-2 text-sm">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                        <dt className="text-muted-foreground sm:min-w-32">Name</dt>
                        <dd>{formatOptional(profile.name)}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                        <dt className="text-muted-foreground sm:min-w-32">Email</dt>
                        <dd>{profile.email}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                        <dt className="text-muted-foreground sm:min-w-32">Affiliation</dt>
                        <dd>{formatOptional(profile.affiliation)}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                        <dt className="text-muted-foreground sm:min-w-32">Country</dt>
                        <dd>{countryName}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                        <dt className="text-muted-foreground sm:min-w-32">Favorite language</dt>
                        <dd>{languageName}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                        <dt className="text-muted-foreground sm:min-w-32">Favorite compiler</dt>
                        <dd>{compilerName}</dd>
                    </div>
                    {user.instructor ? (
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                            <dt className="text-muted-foreground sm:min-w-32">Instructor</dt>
                            <dd>✔</dd>
                        </div>
                    ) : null}
                    {user.administrator ? (
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                            <dt className="text-muted-foreground sm:min-w-32">Administrator</dt>
                            <dd>✔</dd>
                        </div>
                    ) : null}
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                        <dt className="text-muted-foreground sm:min-w-32">User id</dt>
                        <dd className="wrap-break-word">{user.id}</dd>
                    </div>
                </dl>
            </section>
            <Link href="https://jutge.org/profile" target="_blank">
                <Button className="w-full" variant="outline">
                    <EditIcon className="mr-2 size-4" />
                    Edit profile at Jutge.org
                </Button>
            </Link>
        </div>
    )
}
