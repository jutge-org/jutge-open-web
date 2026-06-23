'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import { AgTableFull } from '@/components/administrator/AgTable'
import { useProfileDialog } from '@/components/administrator/users/ProfileDialog'
import { emailRenderer } from '@/lib/administrator/grid-renderers'
import type { ProfileForAdmin } from '@/lib/jutge_api_client'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function UsersListView() {
    const { client } = useJutgeAuth()

    const [runProfileDialog, ProfileDialogComponent] = useProfileDialog({})
    const [rows, setRows] = useState<ProfileForAdmin[]>([])
    const [search, setSearch] = useState('')
    const [message, setMessage] = useState('Search must be at least 3 characters long')

    const colDefs = [
        {
            field: 'user_id',
            width: 100,
            filter: true,
            sortable: true,
            headerName: 'id',
            cellRenderer: (params: { data: ProfileForAdmin }) => (
                <button type="button" className="text-primary" onClick={() => void showProfile(params.data)}>
                    {params.data.user_id}
                </button>
            ),
            valueGetter: (params: { data: ProfileForAdmin }) => params.data.user_id,
            sort: 'asc',
        },
        {
            field: 'email',
            flex: 1,
            cellRenderer: emailRenderer('email'),
            valueGetter: (params: { data: ProfileForAdmin }) => params.data.email,
            filter: true,
            sortable: true,
        },
        { field: 'name', flex: 1, filter: true, sortable: true },
        { field: 'username', flex: 1, filter: true, sortable: true },
        { field: 'birth_year', headerName: 'Year', width: 100, filter: true, sortable: true, cellDataType: 'number' },
        {
            field: 'instructor',
            headerName: 'Instr',
            width: 100,
            filter: true,
            sortable: true,
            cellDataType: 'boolean',
            valueGetter: (params: { data: ProfileForAdmin }) => params.data.instructor === 1,
        },
        {
            field: 'administrator',
            headerName: 'Admin',
            width: 100,
            filter: true,
            sortable: true,
            cellDataType: 'boolean',
            valueGetter: (params: { data: ProfileForAdmin }) => params.data.administrator === 1,
        },
    ]

    async function updateSearch(next: string) {
    const { client } = useJutgeAuth()

        setSearch(next)
        if (next.length < 3) {
            setMessage('Search must be at least 3 characters long')
            setRows([])
            return
        }
        const users = await client.admin.users.getProfiles(next)
        setRows(users)
        setMessage(users.length === 0 ? 'No users found' : `${users.length} users shown`)
    }

    async function showProfile(profile: ProfileForAdmin) {
        await runProfileDialog(profile)
    }

    return (
        <>
            <div className="mb-4 flex flex-row items-center gap-2">
                <div className="text-sm text-muted-foreground">{message}</div>
                <div className="grow" />
                <Input
                    autoFocus
                    className="w-64"
                    placeholder="search by name/email"
                    value={search}
                    onChange={(e) => void updateSearch(e.target.value)}
                />
            </div>
            <AgTableFull rowData={rows} columnDefs={colDefs} />
            <ProfileDialogComponent />
        </>
    )
}
