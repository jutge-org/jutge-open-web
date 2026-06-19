'use client'

import AlertWidget from './AlertWidget'
import CalendarExamsWidget from './CalendarExamsWidget'
import DatabasesWidget from './DatabasesWidget'
import DiskWidget from './DiskWidget'
import DockerStatusWidget from './DockerStatusWidget'
import HeaderWidget from './HeaderWidget'
import HistogramDayWidget from './HistogramDayWidget'
import HistogramHourWidget from './HistogramHourWidget'
import PM2StatusWidget from './PM2StatusWidget'
import RecentConnectedUsersWidget from './RecentConnectedUsersWidget'
import RecentLoadAveragesWidget from './RecentLoadAverages'
import RecentSubmissionsWidget from './RecentSubmissionsWidget'
import ZombiesWidget from './ZombiesWidget'

export default function DashboardView() {
    return (
        <div className="pt-2 flex flex-col gap-4">
            <AlertWidget />
            <HeaderWidget />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                <HistogramHourWidget />
                <HistogramDayWidget />
                <CalendarExamsWidget />
                <RecentSubmissionsWidget />
                <ZombiesWidget />
                <DiskWidget />
                <DatabasesWidget />
                <DockerStatusWidget />
                <PM2StatusWidget />
                <RecentLoadAveragesWidget />
                <RecentConnectedUsersWidget />
            </div>
        </div>
    )
}
