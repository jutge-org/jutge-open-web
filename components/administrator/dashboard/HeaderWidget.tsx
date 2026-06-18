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
import { GaugeIcon } from 'lucide-react'
import { all } from 'radash'
import { useEffect, useState } from 'react'
import { HomepageStats, Zombies } from '@/lib/jutge_api_client'
import Widget from '@/components/administrator/dashboard/Widget'
import Link from 'next/link'

function useIncrementer(top: number, time: number) {
    const [count, setCount] = useState(0)
    const period = 50

    useEffect(() => {
        const interval = setInterval(() => {
            if (count >= top) {
                clearInterval(interval)
                return
            }
            setCount((prev) => Math.floor(prev + top / (time / period)))
        }, period)
        return () => clearInterval(interval)
    }, [top, time, count])

    return count
}

export default function HeaderWidget() {
    //

    const [stats, setStats] = useState<HomepageStats | null>(null)
    const [zombies, setZombies] = useState<Zombies | null>(null)
    const usersIncrementer = useIncrementer(42000, 1000) // approx number of users to do the animation
    const submissionsIncrementer = useIncrementer(6000000, 1000)
    const problemsIncrementer = useIncrementer(6000, 1000)

    async function fetchData() {
        const data = await all({
            stats: fetchHomepageStats(),
            zombies: fetchAdminDashboardZombies(),
        })
        setStats(data.stats)
        setZombies(data.zombies)
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 10 * 1000)
        return () => clearInterval(interval)
    }, [])

    const content = (
        <div className="m-4 w-full grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex flex-col gap-0 items-end">
                <div className="text-3xl text-primary">
                    {numberWithCommas(stats ? stats.users : usersIncrementer)}
                </div>
                <div className="text-sm">users</div>
            </div>
            <div className="flex flex-col gap-0 items-end">
                <div className="text-3xl text-primary">
                    {numberWithCommas(stats ? stats.submissions : submissionsIncrementer)}
                </div>
                <div className="text-sm">submissions</div>
            </div>
            <div className="flex flex-col gap-0 items-end">
                <div className="text-3xl text-primary">
                    {numberWithCommas(stats ? stats.problems : problemsIncrementer)}
                </div>
                <div className="text-sm">problems</div>
            </div>
            <div className="flex flex-col gap-0 items-end">
                <div className="text-3xl text-primary">
                    <Link href="/administrator/queue?view=internal-errors">
                        {zombies ? numberWithCommas(zombies.ies) : <SimpleSpinner />}
                    </Link>
                </div>
                <div className="text-sm">IEs</div>
            </div>
        </div>
    )

    return <Widget icon=<GaugeIcon size={24} strokeWidth={1.25} /> content={content} />
}

function numberWithCommas(x: number) {
    // https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
