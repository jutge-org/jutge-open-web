'use client'

import { adminRemoveSpamUsers, fetchAdminSpamUsers } from '@/actions/administrator'
import { AgTableFull } from '@/components/administrator/AgTable'
import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function GetSpamUsersView() {
    const router = useRouter()
    const [runConfirmDialog, ConfirmDialogComponent] = useConfirmDialog({
        title: 'Remove spam users',
        acceptIcon: <Trash2Icon />,
        acceptLabel: 'Yes, remove',
        cancelLabel: 'No',
    })
    const [spammers, setSpammers] = useState<string[] | null>(null)

    const colDefs = [
        {
            field: 'pos',
            headerName: '#',
            width: 80,
            cellRenderer: (params: { node: { rowIndex: number } }) => params.node.rowIndex + 1,
            type: 'rightAligned',
        },
        { field: 'email', flex: 1 },
    ]

    useEffect(() => {
        void fetchAdminSpamUsers().then(setSpammers)
    }, [])

    async function remove() {
        if (spammers === null) return
        const message = `Are you sure you want to remove ${spammers.length} spam users?`
        if (!(await runConfirmDialog(message))) return
        try {
            await adminRemoveSpamUsers(spammers)
            toast.success('Spam users are being removed')
        } catch {
            toast.error('Error removing spam users')
            return
        }
        router.push('/administrator/users')
    }

    if (spammers === null) {
        return (
            <div className="p-4">
                <Skeleton className="h-64 w-full p-12 text-center">Finding spam users...</Skeleton>
            </div>
        )
    }

    if (spammers.length === 0) {
        return <div className="w-full p-12 text-center">No spam users found</div>
    }

    const rows = spammers.map((email) => ({ email }))
    return (
        <>
            <AgTableFull rowData={rows} columnDefs={colDefs} />
            <div className="mt-4 flex flex-row-reverse gap-2">
                <Button onClick={() => void remove()} className="w-36">
                    <Trash2Icon /> Remove
                </Button>
            </div>
            <ConfirmDialogComponent />
        </>
    )
}
