'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BoltIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Widget from '@/components/administrator/dashboard/Widget'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export default function PM2StatusWidget() {
    const { client } = useJutgeAuth()
    //

    const [status, setStatus] = useState<any[]>([])

    async function fetchData() {
    const { client } = useJutgeAuth()

        setStatus(await client.admin.dashboard.getPM2Status())
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
                        <TableRow key={item.name}>
                            <TableCell className="">{item.name}</TableCell>
                            {/*
                        <TableCell className="text-end">{item.monit.memory}</TableCell>
                        <TableCell className="text-end">{item.monit.cpu}</TableCell>
                        */}
                            <TableCell className="text-end">{item.pm2_env.status === 'online' ? '✓' : '✗'}</TableCell>
                            <TableCell className="text-end">
                                {dayjs.duration(dayjs(item.pm2_env.pm_uptime).diff(dayjs())).humanize()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
            ''
        )

    return <Widget icon=<BoltIcon size={18} /> title="PM2 status" content={content} />
}
