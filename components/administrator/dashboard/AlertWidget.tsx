'use client'

import { fetchAdminDashboardAll } from '@/lib/administrator/client'
import { Prose } from '@/components/documentation/Prose'
import { MessageSquareWarningIcon } from 'lucide-react'
import pluralize from 'pluralize'
import { useEffect, useState } from 'react'
import { AdminDashboard } from '@/lib/jutge_api_client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function AlertWidget() {
    //

    const [data, setData] = useState<AdminDashboard | null>(null)

    async function fetchData() {
        setData(await fetchAdminDashboardAll())
    }

    useEffect(() => {
        void fetchData()
        const interval = setInterval(fetchData, 10 * 1000)
        return () => clearInterval(interval)
    }, [])

    if (!data) return null

    const alerts: string[] = []

    if (data.zombies.pendings > 0) {
        alerts.push(
            `There ${pluralize('is', data.zombies.pendings)} ${numerize(data.zombies.pendings)} pending ${pluralize('submissions', data.zombies.pendings)}.`,
        )
    }

    if (data.zombies.ies > 0) {
        alerts.push(
            `There ${pluralize('is', data.zombies.ies)} ${numerize(data.zombies.ies)} IE ${pluralize('submissions', data.zombies.ies)}.`,
        )
    }

    for (const [, disk] of Object.entries(data.free_disk_space)) {
        if (disk && Number(disk.use.replace('%', '')) > 75) {
            alerts.push(
                `Disk ${disk.disk} is almost full: ${disk.available} available, ${disk.used} used (${disk.use}).`,
            )
        }
    }

    if (data.recent_load_averages.latest_01_minutes > 1.5) {
        alerts.push(`Server load average is ${data.recent_load_averages.latest_01_minutes} (latest min).`)
    }

    if (alerts.length === 0) return null

    return (
        <Alert className="border-primary border-2">
            <MessageSquareWarningIcon className="h-5 w-5" color="hsl(var(--primary))" />
            <AlertTitle className="font-bold text-lg text-primary">Alerts:</AlertTitle>
            <AlertDescription className="">
                <Prose>
                    <ul>
                        {alerts.map((alert, index) => (
                            <li key={index}>{alert}</li>
                        ))}
                    </ul>
                </Prose>
            </AlertDescription>
        </Alert>
    )
}

export function numerize(n: number): string {
    if (n === 0) return 'no'
    if (n === 1) return 'one'
    if (n === 2) return 'two'
    if (n === 3) return 'three'
    if (n === 4) return 'four'
    return n.toString()
}
