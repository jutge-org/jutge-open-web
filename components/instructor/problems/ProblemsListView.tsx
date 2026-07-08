'use client'

import { fetchInstructorProblemTableRows } from '@/actions/instructor'
import { AgTableFull } from '@/components/administrator/AgTable'
import { ExternalLink } from '@/components/ExternalLink'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import type { AbstractProblem } from '@/lib/jutge_api_client'
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
    LucideProps,
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

// Sharing Icons

type LucideIcon = React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>

type IconStateInfo = {
    Icon: LucideIcon
    title: string
}
type StateInfo = {
    positive: IconStateInfo
    negative: IconStateInfo
}

const ProblemState = ({ state, info }: { state: boolean; info: StateInfo }) => {
    const { Icon, title } = state ? info.positive : info.negative
    return (
        <span title={title}>
            <Icon size={14} className={state ? '' : 'opacity-25'} />
        </span>
    )
}

const lockInfo: StateInfo = {
    positive: { Icon: LockIcon, title: 'Protected by passcode' },
    negative: { Icon: UnlockIcon, title: 'Visible to all' },
}
const sharedTestcasesInfo: StateInfo = {
    positive: { Icon: FileBoxIcon, title: 'Test cases shared with instructors' },
    negative: { Icon: FileBoxIcon, title: 'Test cases not shared with instructors' },
}
const sharedSolutionsInfo: StateInfo = {
    positive: { Icon: FileCodeIcon, title: 'Solutions shared with instructors' },
    negative: { Icon: FileCodeIcon, title: 'Solutions not shared with instructors' },
}

const SharingCell = ({ problem }: { problem: ProblemRow }) => (
    <div className="mt-3 flex flex-row gap-2">
        <ProblemState state={Boolean(problem.passcode)} info={lockInfo} />
        <ProblemState state={problem.shared_testcases} info={sharedTestcasesInfo} />
        <ProblemState state={problem.shared_solutions} info={sharedSolutionsInfo} />
    </div>
)

// Language Badges

const LanguageBadge = ({ language, problem }: { language: string; problem: ProblemRow }) => {
    const abstractProblem = problem.abstractProblems[problem.problem_nm]
    if (!abstractProblem) {
        return (
            <Badge variant="secondary" className="mr-1 px-2">
                {language}
            </Badge>
        )
    }
    const { problem_nm } = problem
    const { solution_tags, problems } = abstractProblem
    const { summary } = problems[`${problem_nm}_${language}`]
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant="secondary" className="mr-1 px-2">
                        {language} <BotMessageSquareIcon size={12} className="ml-1" />
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="flex w-64 flex-col gap-2 items-start">
                    <p className="font-semibold">{summary?.summary_1s}</p>
                    <p>{summary?.summary_1p}</p>
                    <p>{summary?.keywords.replaceAll(',', ', ')}</p>
                    <p className="flex gap-1">
                        <BotIcon size={14} className="" /> {summary?.model}
                    </p>
                    <hr />
                    <p>{solution_tags?.tags.replaceAll(',', ', ')}</p>
                    <p className="flex gap-1 justify-start">
                        <BotIcon size={14} className="" /> {solution_tags?.model}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

// Alerts

const AlertIcon = ({ title, Icon }: { title: string; Icon: LucideIcon }) => (
    <span title={title}>
        <Icon size={14} className="text-red-800" />
    </span>
)

const AlertsCell = ({ problem }: { problem: ProblemRow }) => (
    <div className="mt-3 flex flex-row items-center gap-2">
        {problem.deprecated && <AlertIcon title="Deprecated" Icon={SkullIcon} />}
        {!problem.checked && <AlertIcon title="Checks failed" Icon={AlertCircleIcon} />}
        {problem.se_count > 0 && <AlertIcon title={`${problem.se_count} setter errors`} Icon={CatIcon} />}
        {problem.ie_count > 0 && <AlertIcon title={`${problem.ie_count} internal errors`} Icon={BugIcon} />}
    </div>
)

// Problem Table Column Definitions

const problemTableColumnDefs = [
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
        cellRenderer: (p: ICellRendererParams<ProblemRow>) => <SharingCell problem={p.data!} />,
    },
    {
        field: 'languages',
        width: 150,
        filter: true,
        cellRenderer: (p: ICellRendererParams<ProblemRow>) =>
            p.data!.languages.map((language: string) => (
                <LanguageBadge key={language} language={language} problem={p.data!} />
            )),
        valueGetter: (p: ICellRendererParams<ProblemRow>) => p.data!.languages.join(', '),
    },
    {
        field: 'alerts',
        headerName: 'Alerts',
        width: 90,
        filter: false,
        sort: false,
        cellRenderer: (p: ICellRendererParams<ProblemRow>) => <AlertsCell problem={p.data!} />,
    },
]

const ProblemTable = ({ rows, loading }: { rows: ProblemRow[]; loading: boolean }) => {
    const isMobile = useIsMobile()

    let columnDefs = problemTableColumnDefs
    if (isMobile) {
        columnDefs = columnDefs.filter((c) => c.field !== 'annotation' && c.field !== 'created_at')
    }

    return <AgTableFull rowData={rows} columnDefs={columnDefs} loading={loading} />
}

export function ProblemsListView() {
    const [problemRows, setProblemRows] = useState<ProblemRow[]>([])
    const [problemRowsAll, setProblemRowsAll] = useState<ProblemRow[]>([])
    const [showDeprecated, setShowDeprecated] = useState(false)
    const [loading, setLoading] = useState(true)

    async function fetchProblems() {
        setLoading(true)
        try {
            const rows = await fetchInstructorProblemTableRows()
            setProblemRowsAll(rows)
            setProblemRows(rows.filter((row) => !row.deprecated))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProblems()
    }, [])

    function showDeprecatedChange(deprecationChecked: boolean) {
        setShowDeprecated(deprecationChecked)
        setProblemRows(problemRowsAll.filter((row) => row.deprecated === deprecationChecked))
    }

    return (
        <>
            <h1>Authored Problems</h1>
            <div className="flex flex-row gap-2 items-center">
                <Link href="/instructor/problems/new">
                    <Button variant="outline" className="w-36 justify-start" title="Add a new problem">
                        <SquarePlusIcon /> New problem
                    </Button>
                </Link>
                <ExternalLink href="https://github.com/jutge-org/jutge-toolkit">
                    <Button variant="outline" className="w-36 justify-start" title="Open Jutge Toolkit website">
                        <WrenchIcon /> Jutge Toolkit
                    </Button>
                </ExternalLink>
                <div className="grow" />
                <Label className="text-sm">
                    <Switch checked={showDeprecated} onCheckedChange={showDeprecatedChange} />
                    Show deprecated problems
                </Label>
            </div>

            {/* --- Problem Table --- */}
            <ProblemTable rows={problemRows} loading={loading} />
        </>
    )
}
