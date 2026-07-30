'use client'

import type { ComponentType } from 'react'

import { HomeActivityStats } from '@/components/general/HomeActivityStats'
import { HomeRecentCollectibleCards } from '@/components/general/HomeRecentCollectibleCards'
import { HomeRecentCourses } from '@/components/general/HomeRecentCourses'
import { HomeRecentProblems } from '@/components/general/HomeRecentProblems'
import { HomeRecentSubmissions } from '@/components/general/HomeRecentSubmissions'
import { HomeSuggestedProblems } from '@/components/general/HomeSuggestedProblems'
import type { DashboardModuleId } from '@/lib/dashboardModules'

/** The live widget behind each dashboard module id. */
export const HOME_DASHBOARD_MODULE_COMPONENTS: Record<DashboardModuleId, ComponentType> = {
    recentCourses: HomeRecentCourses,
    recentProblems: HomeRecentProblems,
    recentSubmissions: HomeRecentSubmissions,
    suggestedProblems: HomeSuggestedProblems,
    activityStats: HomeActivityStats,
    collectibleCards: HomeRecentCollectibleCards,
}
