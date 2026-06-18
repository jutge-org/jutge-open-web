export const administratorIndexItems = [
    {
        href: '/administrator/dashboard',
        label: 'Dashboard',
        description: 'Operations overview, alerts, and server health',
    },
    {
        href: '/administrator/queue',
        label: 'Queue',
        description: 'Live submission queue and bulk actions',
    },
    {
        href: '/administrator/exams',
        label: 'Exams',
        description: 'Upcoming exams and contests',
    },
    {
        href: '/administrator/users',
        label: 'Users',
        description: 'Search users, remove spam, change passwords',
    },
    {
        href: '/administrator/instructors',
        label: 'Instructors',
        description: 'Manage instructor accounts',
    },
    {
        href: '/administrator/statistics',
        label: 'Statistics',
        description: 'Platform-wide distributions and counters',
    },
    {
        href: '/administrator/heatmaps',
        label: 'Heatmaps',
        description: 'Submission volume calendars',
    },
    {
        href: '/administrator/ranking',
        label: 'Ranking',
        description: 'Top users by problems solved',
    },
] as const

export const administratorUsersIndexItems = [
    {
        href: '/administrator/users/list',
        label: 'List users',
        description: 'Search and browse user profiles',
    },
    {
        href: '/administrator/users/spam',
        label: 'Find spam users',
        description: 'Detect and bulk-remove spam accounts',
    },
    {
        href: '/administrator/users/change-password',
        label: 'Change password',
        description: 'Set a password for a user account',
    },
] as const
