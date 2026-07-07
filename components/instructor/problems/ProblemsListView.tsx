'use client'

import {
    fetchAbstractProblems,
    fetchInstructorAllAlerts,
    fetchInstructorAllSharingSettings,
    fetchInstructorOwnProblems,
} from '@/actions/instructor'
import { AgTableFull } from '@/components/administrator/AgTable'
import { ExternalLink } from '@/components/ExternalLink'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { mapmap } from '@/lib/instructor/utils'
import type { AbstractProblem, ProblemAlerts, SharingSettings } from '@/lib/jutge_api_client'
import type { ICellRendererParams } from 'ag-grid-community'
import dayjs from 'dayjs'
import {
    AlertCircleIcon,
    BotIcon,
    BotMessageSquareIcon,
    BugIcon,
    CatIcon,
    FileBoxIcon,
    FileCodeIcon,
    LockIcon,
    SkullIcon,
    SquarePlusIcon,
    UnlockIcon,
    WrenchIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type ProblemRow = {
    problem_nm: string
    title: string
    created_at: string | number
    updated_at: string | number
    deprecated: boolean
    languages: string[]
    passcode: boolean
    shared_testcases: boolean
    shared_solutions: boolean
    abstractProblems: Record<string, AbstractProblem>
    checked: boolean
    se_count: number
    ie_count: number
}

export function ProblemsListView() {
    const isMobile = useIsMobile()

    const [problemRows, setProblemRows] = useState<ProblemRow[]>([])
    const [problemRowsAll, setProblemRowsAll] = useState<ProblemRow[]>([])
    const [showDeprecated, setShowDeprecated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProblems() {
            setLoading(true)
            try {
                const ownProblems = await fetchInstructorOwnProblems()
                const ownProblemsSharingSettings = await fetchInstructorAllSharingSettings()
                const allAlerts = await fetchInstructorAllAlerts()
                const abstractProblems = await fetchAbstractProblems(ownProblems.join(','))
                const sharingByProblem: Record<string, SharingSettings> = Object.fromEntries(
                    ownProblemsSharingSettings.map((s) => [s.problem_nm, s]),
                )
                const alertsByProblem: Record<string, ProblemAlerts> = Object.fromEntries(
                    allAlerts.map((alerts) => [alerts.problem_nm, alerts]),
                )

                function buildTitle(problem_nm: string) {
                    const problems = Object.values(abstractProblems[problem_nm].problems)
                    return problems.map((problem) => problem.title).join(' / ')
                }

                const rows = ownProblems.map((problem_nm) => {
                    const abstractProblem = abstractProblems[problem_nm]
                    const sharing = sharingByProblem[problem_nm]
                    const alerts = alertsByProblem[problem_nm]
                    return {
                        problem_nm,
                        title: buildTitle(abstractProblem.problem_nm),
                        created_at: abstractProblem.created_at,
                        updated_at: abstractProblem.updated_at,
                        deprecated: abstractProblem.deprecation !== null,
                        languages: mapmap(abstractProblem.problems, (_problem_id, problem) => problem.language_id),
                        passcode: sharing?.passcode === null,
                        shared_testcases: sharing?.shared_testcases ?? false,
                        shared_solutions: sharing?.shared_solutions ?? false,
                        checked: Object.values(abstractProblem.problems).every((problem) => problem.checked !== 0),
                        se_count: alerts?.se_count ?? 0,
                        ie_count: alerts?.ie_count ?? 0,
                        abstractProblems,
                    }
                })

                setProblemRowsAll(rows)
                setProblemRows(rows.filter((row) => !row.deprecated))
            } finally {
                setLoading(false)
            }
        }

        fetchProblems()
    }, [])

    function showDeprecatedChange(deprecationChecked: boolean) {
        setShowDeprecated(deprecationChecked)
        if (deprecationChecked) setProblemRows(problemRowsAll.filter((row) => row.deprecated))
        else setProblemRows(problemRowsAll.filter((row) => !row.deprecated))
    }

    const [colDefs, setColDefs] = useState([
        {
            field: 'problem_nm',
            headerName: 'Id',
            cellRenderer: (p: ICellRendererParams<ProblemRow>) => (
                <Link href={`/instructor/problems/${p.data!.problem_nm}/properties`}>{p.data!.problem_nm}</Link>
            ),
            width: 100,
            filter: true,
            valueGetter: (p: ICellRendererParams<ProblemRow>) => p.data!.problem_nm,
        },
        { field: 'title', flex: 2, filter: true },
        {
            field: 'created_at',
            headerName: 'Created',
            width: 140,
            filter: true,
            valueGetter: (p: ICellRendererParams<ProblemRow>) => dayjs(p.data!.created_at).format('YYYY-MM-DD'),
        },
        {
            field: 'updated_at',
            headerName: 'Updated',
            width: 140,
            filter: true,
            valueGetter: (p: ICellRendererParams<ProblemRow>) => dayjs(p.data!.updated_at).format('YYYY-MM-DD'),
            sort: 'desc',
        },
        {
            field: 'sharing',
            headerName: 'Sharing',
            width: 120,
            filter: false,
            sort: false,
            cellRenderer: (p: ICellRendererParams<ProblemRow>) => (
                <div className="mt-3 flex flex-row gap-2">
                    {!p.data!.passcode ? (
                        <span title="Protected by passcode">
                            <LockIcon size={14} className="text-red-800" />
                        </span>
                    ) : (
                        <span title="Visible to all">
                            <UnlockIcon size={14} className="text-green-800" />
                        </span>
                    )}
                    {p.data!.shared_testcases ? (
                        <span title="Test cases shared with instructors">
                            <FileBoxIcon size={14} className="text-green-800" />
                        </span>
                    ) : (
                        <span title="Test cases not shared with instructors">
                            <FileBoxIcon size={14} className="text-gray-200" />
                        </span>
                    )}

                    {p.data!.shared_solutions ? (
                        <span title="Solutions shared with instructors">
                            <FileCodeIcon size={14} className="text-green-800" />
                        </span>
                    ) : (
                        <span title="Solutions not shared with instructors">
                            <FileCodeIcon size={14} className="text-gray-200" />
                        </span>
                    )}
                </div>
            ),
        },
        {
            field: 'languages',
            width: 150,
            filter: true,
            cellRenderer: (p: ICellRendererParams<ProblemRow>) =>
                p.data!.languages.map((language: string) => (
                    <div key={language}>
                        {p.data!.abstractProblems[p.data!.problem_nm]?.problems[`${p.data!.problem_nm}_${language}`]
                            .summary ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="secondary" className="mr-1 px-2">
                                            {language} <BotMessageSquareIcon size={12} className="ml-1" />
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="flex w-64 flex-col gap-2">
                                        <p className="font-semibold">
                                            {
                                                p.data!.abstractProblems[p.data!.problem_nm].problems[
                                                    `${p.data!.problem_nm}_${language}`
                                                ]?.summary?.summary_1s
                                            }
                                        </p>
                                        <p>
                                            {
                                                p.data!.abstractProblems[p.data!.problem_nm].problems[
                                                    `${p.data!.problem_nm}_${language}`
                                                ]?.summary?.summary_1p
                                            }
                                        </p>
                                        <p>
                                            {p.data!.abstractProblems[p.data!.problem_nm].problems[
                                                `${p.data!.problem_nm}_${language}`
                                            ]?.summary?.keywords.replaceAll(',', ', ')}
                                        </p>
                                        <p className="flex gap-1">
                                            <BotIcon size={14} className="" />
                                            {
                                                p.data!.abstractProblems[p.data!.problem_nm].problems[
                                                    `${p.data!.problem_nm}_${language}`
                                                ]?.summary?.model
                                            }
                                        </p>
                                        <hr />
                                        <p>
                                            {p.data!.abstractProblems[
                                                p.data!.problem_nm
                                            ].solution_tags?.tags.replaceAll(',', ', ')}
                                        </p>
                                        <p className="flex gap-1">
                                            <BotIcon size={14} className="" />
                                            {p.data!.abstractProblems[p.data!.problem_nm].solution_tags?.model}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <Badge variant="secondary" className="mr-1 px-2">
                                {language}
                            </Badge>
                        )}
                    </div>
                )),
            valueGetter: (p: ICellRendererParams<ProblemRow>) => p.data!.languages.join(', '),
        },
        {
            field: 'alerts',
            headerName: 'Alerts',
            width: 90,
            filter: false,
            sort: false,
            cellRenderer: (p: ICellRendererParams<ProblemRow>) => (
                <div className="mt-3 flex flex-row items-center gap-2">
                    {p.data!.deprecated && (
                        <span title="Deprecated">
                            <SkullIcon size={14} className="text-red-800" />
                        </span>
                    )}
                    {!p.data!.checked && (
                        <span title="Checks failed">
                            <AlertCircleIcon size={14} className="text-red-800" />
                        </span>
                    )}
                    {p.data!.se_count > 0 && (
                        <span
                            title={`${p.data!.se_count} setter errors`}
                            className="flex items-center gap-1 text-xs text-gray-500"
                        >
                            <CatIcon size={14} className="text-red-800" />
                        </span>
                    )}
                    {p.data!.ie_count > 0 && (
                        <span
                            title={`${p.data!.ie_count} internal errors`}
                            className="flex items-center gap-1 text-xs text-gray-500"
                        >
                            <BugIcon size={14} className="text-red-800" />
                        </span>
                    )}
                </div>
            ),
        },
    ])

    useEffect(() => {
        if (isMobile)
            setColDefs((colDefs) => colDefs.filter((c) => c.field !== 'annotation' && c.field !== 'created_at'))
    }, [isMobile])

    return (
        <>
            <div className="mb-4 flex flex-row gap-2">
                <Switch checked={showDeprecated} onCheckedChange={showDeprecatedChange} />
                <div className="text-sm">Deprecated problems</div>
                <div className="flex-grow" />
                <ExternalLink href="https://github.com/jutge-org/jutge-toolkit">
                    <Button className="w-36 justify-start" title="Open Jutge Toolkit website">
                        <WrenchIcon />
                        Toolkit
                    </Button>
                </ExternalLink>
                <Link href="/instructor/problems/new">
                    <Button className="w-36 justify-start" title="Add a new problem">
                        <SquarePlusIcon /> New problem
                    </Button>
                </Link>
            </div>
            <AgTableFull rowData={problemRows} columnDefs={colDefs as never} loading={loading} />
        </>
    )
}
