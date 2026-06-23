import { type Country, type JutgeApiClient, type Profile } from '@/lib/jutge_api_client'

export type ProfilePageData = {
    profile: Profile
    countries: Country[]
    languageName: string | null
    compilerName: string | null
    avatarDataUrl: string | null
}

/** Data URL suitable for `<img src={...} />`, or `null` when the user has no avatar or fetch fails. */
export async function fetchStudentAvatarDataUrl(client: JutgeApiClient): Promise<string | null> {
    try {
        const avatar = await client.student.profile.getAvatar()
        if (avatar.data.length === 0) return null
        const binary = String.fromCharCode(...avatar.data)
        const b64 = btoa(binary)
        const mime = avatar.type || 'image/png'
        return `data:${mime};base64,${b64}`
    } catch {
        return null
    }
}

export async function fetchProfilePageData(client: JutgeApiClient): Promise<ProfilePageData> {
    const [profile, countriesRecord, languagesRecord, compilersRecord, avatarDataUrl] = await Promise.all([
        client.student.profile.get(),
        client.tables.getCountries(),
        client.tables.getLanguages(),
        client.tables.getCompilers(),
        fetchStudentAvatarDataUrl(client),
    ])

    const countries = Object.values(countriesRecord).sort((a, b) => a.eng_name.localeCompare(b.eng_name))

    const languageName =
        profile.language_id && languagesRecord[profile.language_id]
            ? languagesRecord[profile.language_id].eng_name
            : null
    const compilerName =
        profile.compiler_id && compilersRecord[profile.compiler_id]
            ? compilersRecord[profile.compiler_id].name
            : null

    return { profile, countries, languageName, compilerName, avatarDataUrl }
}
