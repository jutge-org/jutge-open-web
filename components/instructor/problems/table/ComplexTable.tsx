import { AgTableFull } from '@/components/administrator/AgTable'
import { useIsMobile } from '@/hooks/use-mobile'
import { ICellRendererParams } from 'ag-grid-community'
import dayjs from 'dayjs'
import Link from 'next/link'
import { AlertsCell } from './AlertsCell'
import { LanguageBadgeList } from './LanguageBadge'
import { SharingCell } from './SharingCell'
import { ProblemRow } from './types'

const problemTableColumnDefs = [
    {
        field: 'problem_nm',
        headerName: 'Id',
        cellRenderer: (p: ICellRendererParams<ProblemRow>) => (
            <Link href={`/instructor/problems/${p.data!.problem_nm}/properties`}>{p.data!.problem_nm}</Link>
        ),
        width: 80,
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
        width: 90,
        filter: false,
        sort: false,
        cellRenderer: (p: ICellRendererParams<ProblemRow>) => <SharingCell problem={p.data!} />,
    },
    {
        field: 'languages',
        width: 150,
        filter: true,
        cellRenderer: (p: ICellRendererParams<ProblemRow>) => <LanguageBadgeList problem={p.data!} />,
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

export default function ComplexTable({ rows }: { rows: ProblemRow[] }) {
    const isMobile = useIsMobile()

    let columnDefs = problemTableColumnDefs
    if (isMobile) {
        const includedFields = ['problem_nm', 'title', 'sharing']
        columnDefs = columnDefs.filter((c) => includedFields.includes(c.field))
    }

    return <AgTableFull columnDefs={columnDefs} rowData={rows} loading={false} />
}
