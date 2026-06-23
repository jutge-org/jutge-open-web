'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { updateProfile } from '@/services/mutations/users'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { toast } from 'sonner'

import { ProfileFormRow } from '@/components/profile/ProfileFormRow'
import { ProfileFormShell } from '@/components/profile/ProfileFormShell'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Country, Profile } from '@/lib/jutge_api_client'

type UserProfileEditFormProps = {
    profile: Profile
    countries: Country[]
}

export function UserProfileEditForm({ profile, countries }: UserProfileEditFormProps) {
    const { client } = useJutgeAuth()
    const router = useRouter()
    const [name, setName] = useState(profile.name)
    const [nickname, setNickname] = useState(profile.nickname ?? '')
    const [affiliation, setAffiliation] = useState(profile.affiliation ?? '')
    const [description, setDescription] = useState(profile.description ?? '')
    const [webpage, setWebpage] = useState(profile.webpage ?? '')
    const [birthYear, setBirthYear] = useState(profile.birth_year?.toString() ?? '')
    const [countryId, setCountryId] = useState(profile.country_id ?? '')
    const [timezoneId, setTimezoneId] = useState(profile.timezone_id)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    function handleSave() {
        setErrorMessage(null)

        const parsedBirthYear = birthYear.trim() === '' ? 0 : Number.parseInt(birthYear, 10)
        if (birthYear.trim() !== '' && Number.isNaN(parsedBirthYear)) {
            setErrorMessage('Birth year must be a valid number.')
            return
        }

        startTransition(async () => {
            if (!name.trim()) {
                setErrorMessage('Name is required.')
                return
            }
            if (!countryId.trim()) {
                setErrorMessage('Country is required.')
                return
            }
            if (!timezoneId.trim()) {
                setErrorMessage('Timezone is required.')
                return
            }

            try {
                await updateProfile(client, {
                    name: name.trim(),
                    nickname: nickname.trim(),
                    affiliation: affiliation.trim(),
                    description: description.trim(),
                    webpage: webpage.trim(),
                    birth_year: parsedBirthYear,
                    country_id: countryId.trim(),
                    timezone_id: timezoneId.trim(),
                })

                toast.success('Profile saved.')
                router.refresh()
            } catch (e) {
                setErrorMessage(e instanceof Error ? e.message : 'Failed to update profile.')
            }
        })
    }

    return (
        <ProfileFormShell
            errorMessage={errorMessage}
            onSave={handleSave}
            pending={pending}
            saveLabel="Update profile"
            pendingLabel="Updating profile…"
        >
            <ProfileFormRow label="Name" htmlFor="profile-name">
                <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    aria-invalid={errorMessage && !name.trim() ? true : undefined}
                />
            </ProfileFormRow>

            <ProfileFormRow label="Nickname" htmlFor="profile-nickname">
                <Input
                    id="profile-nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    autoComplete="nickname"
                />
            </ProfileFormRow>

            <ProfileFormRow label="Affiliation" htmlFor="profile-affiliation">
                <Input
                    id="profile-affiliation"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="University or organization"
                />
            </ProfileFormRow>

            <ProfileFormRow label="Country" htmlFor="profile-country">
                <Select value={countryId || undefined} onValueChange={setCountryId}>
                    <SelectTrigger id="profile-country" className="w-full">
                        <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                        {countries.map((country) => (
                            <SelectItem key={country.country_id} value={country.country_id}>
                                {country.eng_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </ProfileFormRow>

            <ProfileFormRow label="Birth year" htmlFor="profile-birth-year">
                <Input
                    id="profile-birth-year"
                    type="number"
                    inputMode="numeric"
                    min={1900}
                    max={new Date().getFullYear()}
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="Optional"
                    className="max-w-xs"
                />
            </ProfileFormRow>

            <ProfileFormRow label="Timezone" htmlFor="profile-timezone">
                <Input
                    id="profile-timezone"
                    value={timezoneId}
                    onChange={(e) => setTimezoneId(e.target.value)}
                    placeholder="Europe/Madrid"
                    className="max-w-xs"
                />
            </ProfileFormRow>

            <ProfileFormRow label="Web page" htmlFor="profile-webpage">
                <Input
                    id="profile-webpage"
                    type="url"
                    value={webpage}
                    onChange={(e) => setWebpage(e.target.value)}
                    placeholder="https://"
                    autoComplete="url"
                />
            </ProfileFormRow>

            <ProfileFormRow label="Description" htmlFor="profile-description" alignStart>
                <MDEditor
                    className="mx-px"
                    height={200}
                    value={description}
                    onChange={(value) => setDescription(value ?? '')}
                    textareaProps={{
                        id: 'profile-description',
                        placeholder: 'A short bio about yourself',
                    }}
                    toolbarBottom
                />
            </ProfileFormRow>
        </ProfileFormShell>
    )
}
