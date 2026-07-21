'use client'

import { PageSpinner } from '@/components/ClientGates'
import { fetchInstructorProblemTableRows } from '@/lib/instructor/client'
import { useEffect, useState } from 'react'
import InstructorProblemTable from './table/InstructorProblemTable'
import type { ProblemRow } from './table/types'

export function ProblemsListView() {
    const [rows, setRows] = useState<ProblemRow[] | null>(null)

    useEffect(() => {
        void fetchInstructorProblemTableRows().then(setRows)
    }, [])

    if (!rows) {
        return <PageSpinner />
    }

    return (
        <>
            <InstructorProblemTable rows={rows} />
        </>
    )
}
