'use client'

import { fetchAdminDashboardFreeDiskSpace } from '@/actions/administrator'
import { SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FreeDiskSpace } from '@/lib/jutge_api_client'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Widget from '@/components/administrator/dashboard/Widget'

export default function DiskWidget() {
    //

    const [data, setData] = useState<FreeDiskSpace | null>(null)

    async function fetchData() {
        setData(await fetchAdminDashboardFreeDiskSpace())
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    let content = <Skeleton className="h-24 w-full mb-2" />
    if (data !== null) {
        content = (
            <Table>
                <TableBody>
                    {Object.entries(data)
                        .filter(([, item]) => item !== null)
                        .map(([key, item]) =>
                            item === null ? (
                                <TableRow key={key}></TableRow>
                            ) : (
                                <TableRow key={key}>
                                    <TableCell>{item.disk}</TableCell>
                                    <TableCell className="text-end">{item.use}</TableCell>
                                </TableRow>
                            ),
                        )}
                </TableBody>
            </Table>
        )
    }

    return <Widget icon=<SaveIcon size={18} /> title="Disk capacities" content={content} />
}
