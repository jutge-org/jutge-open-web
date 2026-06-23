'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { UsersIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RecentConnectedUsers } from '@/lib/jutge_api_client'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Widget from '@/components/administrator/dashboard/Widget'

export default function RecentConnectedUsersWidget() {
    const { client } = useJutgeAuth()
    //

    const [data, setData] = useState<RecentConnectedUsers | null>(null)

    async function fetchData() {
    const { client } = useJutgeAuth()

        setData(await client.admin.dashboard.getRecentConnectedUsers())
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
                    <TableCell>Latest hour</TableCell>
                    <TableCell className="text-end">{data ? data.latest_hour : <SimpleSpinner />}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest day</TableCell>
                    <TableCell className="text-end">{data ? data.latest_day : <SimpleSpinner />}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest week</TableCell>
                    <TableCell className="text-end">{data ? data.latest_week : <SimpleSpinner />}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest month</TableCell>
                    <TableCell className="text-end">{data ? data.latest_month : <SimpleSpinner />}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest year</TableCell>
                    <TableCell className="text-end">{data ? data.latest_year : <SimpleSpinner />}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )

    return <Widget icon=<UsersIcon size={18} /> title="Recent connected users" content={content} />
}
