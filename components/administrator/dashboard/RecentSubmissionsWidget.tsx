'use client'

import {
    fetchAdminDashboardAll,
    fetchAdminDashboardDatabasesInfo,
    fetchAdminDashboardDockerStatus,
    fetchAdminDashboardFreeDiskSpace,
    fetchAdminDashboardPM2Status,
    fetchAdminDashboardRecentConnectedUsers,
    fetchAdminDashboardRecentLoadAverages,
    fetchAdminDashboardRecentSubmissions,
    fetchAdminDashboardSubmissionsHistograms,
    fetchAdminDashboardUpcomingExams,
    fetchAdminDashboardZombies,
    fetchHomepageStats,
    adminFatalizeIEs,
    adminFatalizePendings,
    adminResubmitIEs,
    adminResubmitPendings,
} from '@/actions/administrator'
import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { CogIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RecentSubmissions } from '@/lib/jutge_api_client'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Widget from '@/components/administrator/dashboard/Widget'

export default function RecentSubmissionsWidget() {
    //

    const [data, setData] = useState<RecentSubmissions | null>(null)

    async function fetchData() {
        setData(await fetchAdminDashboardRecentSubmissions())
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 10 * 1000)
        return () => clearInterval(interval)
    }, [])

    const content = (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell>Latest min</TableCell>
                    <TableCell className="text-end">
                        {data ? data.latest_01_minutes : <SimpleSpinner />}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest 5 mins</TableCell>
                    <TableCell className="text-end">
                        {data ? data.latest_05_minutes : <SimpleSpinner />}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest 15 mins</TableCell>
                    <TableCell className="text-end">
                        {data ? data.latest_15_minutes : <SimpleSpinner />}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Latest 60 mins</TableCell>
                    <TableCell className="text-end">
                        {data ? data.latest_60_minutes : <SimpleSpinner />}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )

    return <Widget icon=<CogIcon size={18} /> title="Recent submissions" content={content} />
}
