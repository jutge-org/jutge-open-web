'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import { ServerCogIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { useEffect, useState } from 'react'
import { RecentLoadAverages } from '@/lib/jutge_api_client'
import Widget from '@/components/administrator/dashboard/Widget'

export default function RecentLoadAveragesWidget() {
    const { client } = useJutgeAuth()
    //

    const [data, setData] = useState<RecentLoadAverages | null>(null)

    async function fetchData() {
    const { client } = useJutgeAuth()

        setData(await client.admin.dashboard.getRecentLoadAverages())
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
