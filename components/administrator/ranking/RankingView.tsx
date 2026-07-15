'use client'

import { fetchAdminRanking } from '@/lib/administrator/client'
import { AgTableFull } from '@/components/administrator/AgTable'
import { emailRenderer } from '@/lib/administrator/grid-renderers'
import type { UserRanking } from '@/lib/jutge_api_client'
import { useEffect, useState } from 'react'

export default function RankingView() {
    const [rows, setRows] = useState<UserRanking>([])

    const colDefs = [
        {
            field: 'pos',
            width: 80,
            cellRenderer: (params: { node: { rowIndex: number } }) => params.node.rowIndex + 1,
            type: 'rightAligned',
        },
        { field: 'problems', width: 100, type: 'rightAligned' },
        { field: 'name', flex: 2 },
        { field: 'nickname', flex: 1 },
        { field: 'email', flex: 3, cellRenderer: emailRenderer('email') },
    ]

    useEffect(() => {
        void fetchAdminRanking(100).then(setRows)
    }, [])

    return <AgTableFull rowData={rows} columnDefs={colDefs} />
}
