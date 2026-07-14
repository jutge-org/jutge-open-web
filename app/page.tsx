import { HomePageGuest } from '@/components/general/HomePageGuest'
import { HomePageUser } from '@/components/general/HomePageUser'
import { isAuthenticated, tryGetCurrentUser } from '@/lib/auth'

export default async function Home() {
    const authenticated = await isAuthenticated()

    if (authenticated) {
        const user = await tryGetCurrentUser()
        return <HomePageUser user={user} />
    }

    return <HomePageGuest />
}
