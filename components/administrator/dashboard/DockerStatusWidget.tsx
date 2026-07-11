'use client'

import { fetchAdminDashboardDockerStatus } from '@/lib/administrator/client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ContainerIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Widget from '@/components/administrator/dashboard/Widget'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export default function DockerStatusWidget() {
    //

    const [status, setStatus] = useState<any[]>([])

    async function fetchData() {
        setStatus(await fetchAdminDashboardDockerStatus())
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const content =
        status.length > 0 ? (
            <Table>
                <TableBody>
                    {status.map((item: any) => (
                        <TableRow key={item.Names}>
                            <TableCell className="">{item.Names}</TableCell>
                            {/*
                        <TableCell className="text-end">{item.monit.memory}</TableCell>
                        <TableCell className="text-end">{item.monit.cpu}</TableCell>
                        */}
                            <TableCell className="text-end">{item.State === 'running' ? '✓' : item.State}</TableCell>
                            <TableCell className="text-end">
                                {(item.Size as string).split(' ')[2].replace(')', '')}
                            </TableCell>
                            <TableCell className="text-end">
                                {(item.RunningFor as string).replace(' ago', '')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
            ''
        )

    return <Widget icon=<ContainerIcon size={18} /> title="Docker status" content={content} />
}
