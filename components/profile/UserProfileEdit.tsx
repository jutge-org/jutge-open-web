import { getCurrentClient } from '@/lib/auth'
import { UserProfileEditForm } from '@/components/profile/UserProfileEditForm'
import { fetchProfilePageData } from '@/services/queries/users'

export async function UserProfileEdit() {
    const client = await getCurrentClient()
    const { profile, countries } = await fetchProfilePageData(client)

    return <UserProfileEditForm profile={profile} countries={countries} />
}
