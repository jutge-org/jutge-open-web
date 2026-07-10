'use client'

import { ExternalLink } from '@/components/ExternalLink'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn, formatDate } from '@/lib/utils'
import { ChevronDown, ChevronUp, SquarePlusIcon, WrenchIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useState } from 'react'
import { LanguageBadgeList } from './LanguageBadge'
import { SharingCell } from './SharingCell'
import { ProblemRow } from './types'

type Column = 'id' | 'sharing' | 'title' | 'created' | 'updated'
type Direction = 'asc' | 'desc'
type Order = null | {
    column: Column
    direction: Direction
}
type ColumnSortFunc = (a: ProblemRow, b: ProblemRow) => number

type ColumnConfig = {
    column: Column
    size: number
    align: 'left' | 'right'
    fixed?: boolean
}

const allColumns: ColumnConfig[] = [
    { column: 'id', size: 4, align: 'left' },
    { column: 'sharing', size: 4.5, align: 'left', fixed: true },
    { column: 'title', size: 40, align: 'left' },
    { column: 'updated', size: 5, align: 'right' },
]

const sortFunctions: Record<Column, Record<Direction, ColumnSortFunc> | undefined> = {
    id: {
        asc: (a, b) => a.problem_nm.localeCompare(b.problem_nm),
        desc: (a, b) => b.problem_nm.localeCompare(a.problem_nm),
    },
    sharing: undefined,
    title: {
        asc: (a, b) => a.title.localeCompare(b.title),
        desc: (a, b) => b.title.localeCompare(a.title),
    },
    created: {
        asc: (a, b) => {
            const da = new Date(a.created_at)
            const db = new Date(b.created_at)
            return da.getTime() - db.getTime()
        },
        desc: (a, b) => {
            const da = new Date(a.created_at)
            const db = new Date(b.created_at)
            return db.getTime() - da.getTime()
        },
    },
    updated: {
        asc: (a, b) => {
            const da = new Date(a.updated_at)
            const db = new Date(b.updated_at)
            return da.getTime() - db.getTime()
        },
        desc: (a, b) => {
            const da = new Date(a.updated_at)
            const db = new Date(b.updated_at)
            return db.getTime() - da.getTime()
        },
    },
}

const ColumnHeader = ({
    column,
    orderIcon,
    width,
    align = 'left',
    onClick,
}: {
    column: Column
    orderIcon: ReactNode
    width: number
    align?: 'left' | 'right'
    onClick: (() => void) | undefined
}) => {
    return (
        <th style={{ width: `${width}em` }}>
            <div
                className={cn('flex flew-row items-center gap-1', align === 'left' ? 'justify-start' : 'justify-end')}
                onClick={onClick}
            >
                {align === 'right' ? (
                    <>
                        {orderIcon} {column}
                    </>
                ) : (
                    <>
                        {column} {orderIcon}
                    </>
                )}
            </div>
        </th>
    )
}

const Table = ({ rows, showDeprecated }: { rows: ProblemRow[]; showDeprecated: boolean }) => {
    const [order, setOrder] = useState<Order>({ column: 'updated', direction: 'desc' })

    const toggleOrder = (column: Column) => () => {
        setOrder((prev) => {
            if (prev != null && prev.column === column) {
                return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
            } else {
                return { column, direction: 'asc' }
            }
        })
    }

    const filteredRows = rows.filter((row) => row.deprecated === showDeprecated)
    let sortedRows = filteredRows
    if (order) {
        const sortFns = sortFunctions[order.column]
        if (sortFns) {
            sortedRows.sort(sortFns[order.direction])
        }
    }

    const orderIcon = (column: Column) => {
        let icon = undefined
        if (order?.column === column) {
            icon = {
                asc: <ChevronUp size={16} />,
                desc: <ChevronDown size={16} />,
            }[order.direction]
        }
        return icon
    }

    return (
        <table className="table-fixed [&_td]:py-1 [&_td]:align-baseline">
            <thead>
                <tr className="*:py-2 *:select-none [&_span]:cursor-pointer">
                    {allColumns.map(({ align, column, size, fixed }) => (
                        <ColumnHeader
                            key={column}
                            orderIcon={orderIcon(column)}
                            column={column}
                            width={size}
                            onClick={fixed ? undefined : toggleOrder(column)}
                            align={align}
                        />
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedRows.map((row) => (
                    <tr key={row.problem_nm} className="border-t">
                        <td className="font-mono text-sm opacity-60 flex flex-row">{row.problem_nm}</td>
                        <td className="relative top-[0.1em]">
                            <SharingCell problem={row} />
                        </td>
                        <td className="pr-2 flex flex-row items-center">
                            <Link href={`/instructor/problems/${row.problem_nm}/properties`} className="hover:underline">
                                <span className="line-clamp-1">{row.title}</span>
                            </Link>
                            <LanguageBadgeList className="ml-2" problem={row} />
                        </td>
                        <td className="text-sm opacity-60 text-right">{formatDate(row.updated_at)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default function InstructorProblemTable({ rows }: { rows: ProblemRow[] }) {
    const [showDeprecated, setShowDeprecated] = useState(false)
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
            <Table rows={rows} showDeprecated={showDeprecated} />
            {/* <ComplexTable rows={rows} /> */}
        </>
    )
}
