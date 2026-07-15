'use client'

import { fetchAdminDashboardRecentLoadAverages } from '@/lib/administrator/client'
import { ServerCogIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { useEffect, useState } from 'react'
import { RecentLoadAverages } from '@/lib/jutge_api_client'
import Widget from '@/components/administrator/dashboard/Widget'

export default function RecentLoadAveragesWidget() {
    //

    const [data, setData] = useState<RecentLoadAverages | null>(null)

    async function fetchData() {
        setData(await fetchAdminDashboardRecentLoadAverages())
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const content = (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell>Latest min</TableCell>
                    <TableCell className="text-end">{data ? data.latest_01_minutes : <SimpleSpinner />}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest 5 mins</TableCell>
                    <TableCell className="text-end">{data ? data.latest_05_minutes : <SimpleSpinner />}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest 15 mins</TableCell>
                    <TableCell className="text-end">{data ? data.latest_15_minutes : <SimpleSpinner />}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )

    return <Widget icon=<ServerCogIcon size={18} /> title="Server load average" content={content} />
}
