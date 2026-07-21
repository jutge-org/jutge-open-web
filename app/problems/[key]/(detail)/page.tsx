'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

import { useAuth } from '@/components/AuthProvider'
import MainBreadcrumbs from '@/components/general/MainBreadcrumbs'
import { PageTitle } from '@/components/general/PageTitle'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { QuizProblemUnsupportedCard } from '@/components/problems/QuizProblemUnsupportedCard'
import { useProblemShell } from '@/hooks/useProblemShell'
import { getPreferredLanguageId } from '@/lib/data/auth'
import { fetchAbstractProblem } from '@/lib/data/problemDetail'
import { getPreferredProblemVariant } from '@/lib/problemVariants'
import { isQuizProblem, parseProblemKey } from '@/lib/problems'
import { problemBaseBreadcrumbs, problemLoadedBreadcrumbs } from '@/lib/problemBreadcrumbs'

type QuizData = {
    problem_nm: string
    title: string
    author: string | null
}

export default function ProblemPage() {
    const { user, loading: authLoading } = useAuth()
    const params = useParams<{ key: string }>()
    const key = params.key
    const authenticated = user !== null

    const [quiz, setQuiz] = useState<QuizData | null | undefined>(undefined)
    const shell = useProblemShell({ key, isAuthenticated: authenticated })

    useEffect(() => {
        if (authLoading) return

        let cancelled = false
        setQuiz(undefined)

        void (async () => {
            const parsed = parseProblemKey(key)
            if (parsed.kind === 'invalid') {
                if (!cancelled) setQuiz(null)
                return
            }

            const abstractProblem = await fetchAbstractProblem(parsed.problem_nm)
            if (cancelled) return
            if (!abstractProblem) {
                setQuiz(null)
                return
            }

            if (!isQuizProblem(abstractProblem.driver_id)) {
                setQuiz(null)
                return
            }

            const preferredLanguageId = await getPreferredLanguageId()
            if (cancelled) return

            const variant = getPreferredProblemVariant(abstractProblem, preferredLanguageId)
            setQuiz({
                problem_nm: parsed.problem_nm,
                title: variant?.title ?? parsed.problem_nm,
                author: abstractProblem.author,
            })
        })()

        return () => {
            cancelled = true
        }
    }, [authLoading, key])

    const quizResolved = quiz !== undefined
    const isQuiz = quizResolved && quiz !== null
    const shellActive = quizResolved && quiz === null
    const loading = authLoading || !quizResolved || (shellActive && shell.detail === undefined)

    if (!loading && shellActive && shell.detail === null) {
        notFound()
    }

    if (isQuiz && quiz) {
        return (
            <div className="flex flex-col gap-6">
                <MainBreadcrumbs
                    breadcrumbs={problemLoadedBreadcrumbs(key, quiz.problem_nm, quiz.title, [], authenticated)}
                />
                {!authenticated ? <PageTitle section="/problems" authenticated={false} hidden={false} /> : null}
                <QuizProblemUnsupportedCard title={quiz.title} problemNm={quiz.problem_nm} author={quiz.author} />
            </div>
        )
    }

    const breadcrumbs =
        shellActive && shell.detail
            ? problemLoadedBreadcrumbs(
                  key,
                  shell.detail.problem.problem_nm,
                  shell.detail.problem.title,
                  [],
                  authenticated,
              )
            : problemBaseBreadcrumbs(key, authenticated)

    return (
        <div className="flex flex-col gap-6">
            <MainBreadcrumbs breadcrumbs={breadcrumbs} />
            {!authenticated ? <PageTitle section="/problems" authenticated={false} hidden={false} /> : null}
            {shellActive && shell.detail ? (
                <ProblemDetail
                    pageKey={key}
                    data={shell.detail}
                    status={shell.status}
                    defaultCompilerId={shell.defaultCompilerId}
                    isInstructorOwner={shell.isInstructorOwner ?? false}
                    isAdministrator={user?.administrator ?? false}
                    showNav={authenticated}
                    overlapHeader={authenticated}
                />
            ) : (
                <ProblemDetail
                    loading
                    pageKey={key}
                    showNav={authenticated}
                    overlapHeader={authenticated}
                />
            )}
        </div>
    )
}
