'use client'

import { adminAddInstructor, adminRemoveInstructor, fetchAdminInstructors } from '@/actions/administrator'
import { AgTableFull } from '@/components/administrator/AgTable'
import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import { useAddInstructorDialog } from '@/components/administrator/instructors/AddInstructorDialog'
import { useIsMobile } from '@/hooks/use-mobile'
import { emailRenderer } from '@/lib/administrator/grid-renderers'
import type { InstructorEntries, InstructorEntry } from '@/lib/jutge_api_client'
import { Button } from '@/components/ui/button'
import type { RowSelectionOptions } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { CircleMinusIcon, CirclePlusIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function InstructorsView() {
    const isMobile = useIsMobile()
    const [rows, setRows] = useState<InstructorEntries>([])
    const [colDefs, setColDefs] = useState<Record<string, unknown>[]>([])
    const gridRef = useRef<AgGridReact<InstructorEntry>>(null)
    const [runAddInstructorDialog, AddInstructorDialog] = useAddInstructorDialog()
    const [runConfirmDialog, ConfirmDialog] = useConfirmDialog({ title: 'Are you sure?' })

    useEffect(() => {
        setColDefs([
            { field: 'username', flex: 1, filter: true, sort: 'asc' },
            { field: 'name', flex: 1, filter: true, hide: isMobile },
            {
                field: 'email',
                flex: 1,
                filter: true,
                hide: isMobile,
                cellRenderer: emailRenderer('email'),
                valueGetter: (params: { data: InstructorEntry }) => params.data.email,
            },
        ])
    }, [isMobile])

    const rowSelection = useMemo<RowSelectionOptions<InstructorEntry>>(
        () => ({ mode: 'multiRow', headerCheckbox: false }),
        [],
    )

    useEffect(() => {
        void fetchAdminInstructors().then(setRows)
    }, [])

    async function addAction() {
        const result = await runAddInstructorDialog()
        if (!result) return
        try {
            await adminAddInstructor(result)
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Some error occurred')
            return
        }
        toast.success(`Instructor ${result.username} added.`)
        setRows(await fetchAdminInstructors())
    }

    async function removeAction() {
        const grid = gridRef.current!.api
        const emails = grid.getSelectedNodes().map((node) => node.data!.email)
        if (emails.length === 0) {
            toast.info('Select the instructors to remove.')
            return
        }
        if (!(await runConfirmDialog(`Are you sure you want to remove ${emails.length} instructors?`))) return
        for (const email of emails) {
            try {
                await adminRemoveInstructor(email)
            } catch (e) {
                toast.error(e instanceof Error ? e.message : 'Some error occurred.')
            }
            toast.success(`Instructor ${email} removed.`)
        }
        setRows(await fetchAdminInstructors())
    }

    return (
        <>
            <div className="mb-4 flex flex-row gap-2">
                <div className="grow" />
                <Button className="w-32 justify-start" onClick={() => void addAction()}>
                    <CirclePlusIcon /> Add
                </Button>
                <Button className="w-32 justify-start" onClick={() => void removeAction()}>
                    <CircleMinusIcon /> Remove
                </Button>
            </div>
            <AgTableFull rowData={rows} columnDefs={colDefs} ref={gridRef} rowSelection={rowSelection} />
            <AddInstructorDialog />
            <ConfirmDialog />
        </>
    )
}
