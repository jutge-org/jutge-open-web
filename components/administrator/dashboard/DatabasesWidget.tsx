'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import byteSize from 'byte-size'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)
import { SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DatabasesInfo } from '@/lib/jutge_api_client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Widget from '@/components/administrator/dashboard/Widget'

export default function DatabasesWidget() {
    const { client } = useJutgeAuth()
    //

    const [data, setData] = useState<DatabasesInfo>([])

    async function fetchData() {
    const { client } = useJutgeAuth()

        setData(await client.admin.dashboard.getDatabasesInfo())
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 300 * 1000)
        return () => clearInterval(interval)
    }, [])

    let content = <Skeleton className="h-24 w-full mb-2" />
    if (data !== null) {
        content = (
            <Table>
                <TableBody>
                    {data.map((db) => (
                        <TableRow key={db.name}>
                            <TableCell>{db.name}</TableCell>
                            <TableCell className="text-end">{byteSize(db.size).toString()}</TableCell>
                            {db.name !== 'jutge' ? (
                                <TableCell
                                    className={cn(
                                        'text-end',
                                        dayjs().diff(dayjs(db.mtime), 'day') >= 1 ? 'text-red-500' : '',
                                    )}
                                >
                                    {dayjs.duration(dayjs(db.mtime).diff(dayjs())).humanize()}
                                </TableCell>
                            ) : (
                                <TableCell className="text-end">—</TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return <Widget icon=<SaveIcon size={18} /> title="Databases" content={content} />
}
