'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

import { SupervisorGate } from '@/components/ClientGates'
import { PageTitle } from '@/components/general/PageTitle'
import { ProblemDetail } from '@/components/problems/ProblemDetail'
import { SubmissionDetailView } from '@/components/submissions/SubmissionDetailView'
import { SubmissionPendingRefresh } from '@/components/submissions/SubmissionPendingRefresh'
import { SupervisionPageShell } from '@/components/supervision/SupervisionPageShell'
import { SupervisionProblemNav } from '@/components/supervision/SupervisionProblemNav'
import { useSupervisionPageMeta, supervisionContextWithMeta } from '@/hooks/use-supervision-page-meta'
import { useSupervisionProblemShell } from '@/hooks/use-supervision-problem-shell'
import { useSupervisionParams } from '@/hooks/use-supervision-params'
import {
    fetchSupervisionSubmissionDetail,
    fetchSupervisionSubmissionsForProblem,
} from '@/lib/data/supervisionSubmissions'
import type { SubmissionDetailData } from '@/lib/data/submissions'
import { isLinkableTestcase } from '@/lib/submissions'
import {
    buildSupervisionSubmissionNavLinks,
    supervisionProblemSubmissionsHref,
    supervisionSubmissionCodeHref,
    supervisionSubmissionHref,
    supervisionSubmissionTestcaseHref,
    supervisionBaseBreadcrumbs,
    supervisionProblemBreadcrumbs,
} from '@/lib/supervision'
import type { SubmissionNavLinks } from '@/lib/submissions'

export default function SupervisionSubmissionDetailPage() {
    return (
        <SupervisorGate>
            <SupervisionSubmissionDetailPageContent />
        </SupervisorGate>
    )
}

function SupervisionSubmissionDetailPageContent() {
    const params = useParams<{ key: string; submission_id: string }>()
    const key = params.key
    const submission_id = params.submission_id
    const baseContext = useSupervisionParams()
    const meta = useSupervisionPageMeta(baseContext)
    const context = useMemo(() => supervisionContextWithMeta(baseContext, meta), [baseContext, meta])
    const shell = useSupervisionProblemShell({ key, context })
    const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetailData | null | undefined>(undefined)
    const [navigation, setNavigation] = useState<SubmissionNavLinks | null | undefined>(undefined)

    const loadDetail = useCallback(async () => {
        return fetchSupervisionSubmissionDetail(context, key, submission_id)
    }, [context, key, submission_id])

    useEffect(() => {
        let cancelled = false
        setSubmissionDetail(undefined)

        void loadDetail().then((detail) => {
            if (!cancelled) setSubmissionDetail(detail)
        })

        return () => {
            cancelled = true
        }
    }, [loadDetail])

    useEffect(() => {
        if (!shell.problem_nm) return

        let cancelled = false
        setNavigation(undefined)

        void fetchSupervisionSubmissionsForProblem(context, shell.problem_nm).then((submissions) => {
            if (!cancelled) {
                setNavigation(buildSupervisionSubmissionNavLinks(submissions, submission_id, context, key))
            }
        })

        return () => {
            cancelled = true
        }
    }, [context, key, shell.problem_nm, submission_id])

    if (shell.detail === null) {
        notFound()
    }

    if (submissionDetail === null) {
        notFound()
    }

    const problemId = submissionDetail?.submission.problem_id ?? key
    const submissionHref = supervisionSubmissionHref(context, problemId, submission_id)
    const codeHref = supervisionSubmissionCodeHref(context, problemId, submission_id)

    const breadcrumbs =
        shell.detail && shell.problem_nm
            ? supervisionProblemBreadcrumbs(
                  context,
                  key,
                  shell.detail.problem.problem_nm,
                  shell.detail.problem.title,
                  [
                      {
                          title: 'Submissions',
                          url: supervisionProblemSubmissionsHref(context, key),
                      },
                      { title: submission_id, url: submissionHref },
                  ],
                  meta?.courseTitle,
              )
            : [
                  ...supervisionBaseBreadcrumbs(context, meta?.courseTitle),
                  { title: 'Submissions', url: '#' },
                  { title: submission_id, url: '#' },
              ]

    const submissionLoading = submissionDetail === undefined

    const getTestcaseHref = (testcase: string) => {
        if (!isLinkableTestcase(testcase)) {
            return null
        }
        return supervisionSubmissionTestcaseHref(context, problemId, submission_id, testcase)
    }

    return (
        <SupervisionPageShell context={context} courseTitle={meta?.courseTitle} breadcrumbs={breadcrumbs}>
            <PageTitle section="/supervision" authenticated hidden={false} />
            {shell.detail ? (
                <ProblemDetail
                    pageKey={key}
                    data={shell.detail}
                    status={shell.status}
                    readOnly
                    showNav={false}
                    showStatement={false}
                    showTestcases={false}
                    showInformation={false}
                    supervisionContext={context}
                >
                    <div className="flex flex-col gap-6">
                        <SupervisionProblemNav pageKey={key} context={context} />
                        {submissionLoading ? (
                            <SubmissionDetailView loading submissionId={submission_id} />
                        ) : (
                            <>
                                <SubmissionPendingRefresh
                                    isPending={submissionDetail!.verdict === 'Pending'}
                                    onRefresh={async () => {
                                        const detail = await loadDetail()
                                        if (detail) setSubmissionDetail(detail)
                                    }}
                                />
                                <SubmissionDetailView
                                    data={submissionDetail!}
                                    codeHref={codeHref}
                                    problemKey={key}
                                    navigation={navigation ?? null}
                                    getTestcaseHref={getTestcaseHref}
                                />
                            </>
                        )}
                    </div>
                </ProblemDetail>
            ) : (
                <ProblemDetail
                    loading
                    pageKey={key}
                    showNav={false}
                    showStatement={false}
                    showTestcases={false}
                    showInformation={false}
                >
                    <SubmissionDetailView loading submissionId={submission_id} />
                </ProblemDetail>
            )}
        </SupervisionPageShell>
    )
}
