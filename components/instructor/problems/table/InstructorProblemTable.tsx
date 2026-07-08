'use client'

import { AgTableFull } from '@/components/administrator/AgTable'
import { ExternalLink } from '@/components/ExternalLink'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ICellRendererParams } from 'ag-grid-community'
import dayjs from 'dayjs'
import { SquarePlusIcon, WrenchIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ProblemRow } from './types'
import { AlertsCell } from './AlertsCell'
import { SharingCell } from './SharingCell'
import { LanguageBadge } from './LanguageBadge'
import LoadingSpinner from '@/components/LoadingSpinner'

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

export default function InstructorProblemTable({ rows }: { rows: ProblemRow[] }) {
    const [showDeprecated, setShowDeprecated] = useState(false)

    const isMobile = useIsMobile()

    let columnDefs = problemTableColumnDefs
    if (isMobile) {
        columnDefs = columnDefs.filter((c) => c.field !== 'annotation' && c.field !== 'created_at')
    }

    const filteredRows = rows.filter((row) => row.deprecated === showDeprecated)

    return (
        <>
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
                    <Switch checked={showDeprecated} onCheckedChange={(checked) => setShowDeprecated(checked)} />
                    Show deprecated problems
                </Label>
            </div>

            {/* --- Problem Table --- */}
            <AgTableFull columnDefs={columnDefs} rowData={filteredRows} loading={false} />
        </>
    )
}
