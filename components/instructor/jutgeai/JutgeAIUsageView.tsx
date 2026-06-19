'use client'

import { fetchJutgeaiLlmUsage } from '@/actions/instructor'
import { AgTableFull } from '@/components/administrator/AgTable'
import type { LlmUsageEntry } from '@/lib/jutge_api_client'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export function JutgeAIUsageView() {
    const [rows, setRows] = useState<LlmUsageEntry[]>([])

    const colDefs = [
        { field: 'label', flex: 2, filter: true },
        {
            field: 'created_at',
            headerName: 'Created',
            width: 180,
            filter: true,
            valueGetter: (p: { data: LlmUsageEntry }) =>
                dayjs(p.data.created_at).format('YYYY-MM-DD HH:mm:ss'),
        },
        { field: 'model', flex: 2, filter: true },
        {
            field: 'duration',
            headerName: 'Duration',
            width: 110,
            filter: false,
            type: 'rightAligned',
            valueFormatter: (p: { data: LlmUsageEntry }) => `${Number(p.data.duration).toFixed(3)}`,
        },
        {
            field: 'input_tokens',
            headerName: 'TokensIn',
            width: 110,
            filter: false,
            type: 'rightAligned',
        },
        {
            field: 'output_tokens',
            headerName: 'TokensOut',
            width: 110,
            filter: false,
            type: 'rightAligned',
        },
        {
            field: 'finish_reason',
            headerName: 'Finish',
            width: 110,
            filter: false,
            type: 'rightAligned',
        },
    ]

    useEffect(() => {
        async function fetchEntries() {
            const entries = await fetchJutgeaiLlmUsage()
            setRows(entries)
        }

        fetchEntries()
    }, [])

    return (
        <>
            <AgTableFull rowData={rows} columnDefs={colDefs} />
            <div className="mt-4 flex flex-row gap-2">
                <div className="text-sm">
                    This table shows your usage of Jutge<sup>AI</sup>. Rates apply.
                </div>
                <div className="flex-grow" />
            </div>
        </>
    )
}
