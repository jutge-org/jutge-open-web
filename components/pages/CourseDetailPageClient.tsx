'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { AuthedGate } from '@/components/auth/AuthGates'
import { CourseDetail } from '@/components/courses/CourseDetail'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { buildCourseRow, courseHref } from '@/lib/courses'
import type { LastSubmissionInfo } from '@/lib/submissions'
import type { AbstractStatus, Language } from '@/lib/jutge_api_client'
import { fetchCourse, type FetchedCourse } from '@/services/queries/courses'
import { fetchCourseListsData, type CourseListData } from '@/services/queries/lists'
import { fetchAllAbstractProblems, fetchLanguages, fetchStudentProblemStatuses } from '@/services/queries/problems'
import { fetchLastSubmissionsByProblemNm } from '@/services/queries/submissions'

type CourseDetailPageClientProps = {
    courseKey: string
}

export function CourseDetailPageClient({ courseKey }: CourseDetailPageClientProps) {
    const { client, languageId, loading: authLoading } = useJutgeAuth()
    const [notFoundState, setNotFoundState] = useState(false)
    const [courseData, setCourseData] = useState<{
        fetched: FetchedCourse
        lists: CourseListData[]
        languages: Record<string, Language>
        statuses: Record<string, AbstractStatus>
        lastSubmissions: Record<string, LastSubmissionInfo>
    } | null>(null)

    useEffect(() => {
        if (authLoading) return

        let cancelled = false

        void (async () => {
            const result = await fetchCourse(client, courseKey)
            if (cancelled) return
            if (!result) {
                setNotFoundState(true)
                return
            }

            const [languages, statuses, lastSubmissionsByProblemNm] = await Promise.all([
                fetchLanguages(client),
                fetchStudentProblemStatuses(client),
                fetchLastSubmissionsByProblemNm(client),
            ])
            if (cancelled) return

            const problems = await fetchAllAbstractProblems(client, languageId)
            if (cancelled) return

            const lists = await fetchCourseListsData(client, result.course.lists, problems)
            if (cancelled) return

            setCourseData({
                fetched: result,
                lists,
                languages,
                statuses,
                lastSubmissions: Object.fromEntries(lastSubmissionsByProblemNm),
            })
        })()

        return () => {
            cancelled = true
        }
    }, [authLoading, client, courseKey, languageId])

    if (notFoundState) {
        notFound()
    }

    if (authLoading || !courseData) {
        return (
            <AuthedGate>
                <p className="py-16 text-center text-muted-foreground">Loading…</p>
            </AuthedGate>
        )
    }

    const { fetched, lists, languages, statuses, lastSubmissions } = courseData
    const row = buildCourseRow(fetched.course, fetched.status, fetched.courseKey)
    const href = courseHref(fetched.courseKey)

    return (
        <AuthedGate>
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={[
                        { title: 'Courses', url: '/courses' },
                        { title: row.title, url: href },
                    ]}
                />
                <CourseDetail
                    courseKey={fetched.courseKey}
                    course={fetched.course}
                    status={fetched.status}
                    lists={lists}
                    languages={languages}
                    statuses={statuses}
                    lastSubmissions={lastSubmissions}
                />
            </div>
        </AuthedGate>
    )
}
