'use client'

import { ExternalLink } from '@/components/ExternalLink'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn, formatDate, includesNocaps } from '@/lib/utils'
import { ChevronDown, ChevronUp, CircleSlash2, PlusIcon, SearchIcon, WrenchIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
    width?: number
    flex?: number
    align: 'start' | 'end' | 'center'
    fixed?: boolean
}

const allColumns: ColumnConfig[] = [
    { column: 'id', width: 12, align: 'start' },
    { column: 'sharing', width: 22, align: 'center', fixed: true },
    { column: 'title', flex: 1, align: 'start' },
    { column: 'updated', width: 22, align: 'end' },
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
    flex,
    align = 'start',
    onClick,
}: {
    column: Column
    orderIcon: ReactNode
    width?: number
    flex?: number
    align?: 'start' | 'end' | 'center'
    onClick: (() => void) | undefined
}) => {
    return (
        <div
            className={cn(
                'h-8 uppercase text-sm rounded-sm px-1 select-none',
                onClick !== undefined ? 'hover:bg-foreground/5' : '',
                'flex flew-row items-center gap-1',
                width ? `w-${width}` : '',
                flex ? `flex-${flex}` : '',
                `justify-${align}`,
                onClick !== undefined ? 'hover:cursor-pointer' : 'opacity-70',
            )}
            onClick={onClick}
        >
            {align === 'end' ? (
                <>
                    {orderIcon} {column}
                </>
            ) : (
                <>
                    {column} {orderIcon}
                </>
            )}
        </div>
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

    const filteredRows = useMemo(() => {
        return rows.filter((row) => row.deprecated === showDeprecated)
    }, [rows, showDeprecated])

    const sortedRows = useMemo(() => {
        const result = [...filteredRows]
        if (order) {
            const sortFns = sortFunctions[order.column]
            if (sortFns) {
                result.sort(sortFns[order.direction])
            }
        }
        return result
    }, [filteredRows, order])

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
        <div>
            <div className="flex flex-row items-center h-10">
                {allColumns.map(({ align, column, width, flex, fixed }) => (
                    <ColumnHeader
                        key={column}
                        orderIcon={orderIcon(column)}
                        onClick={fixed ? undefined : toggleOrder(column)}
                        column={column}
                        align={align}
                        width={width}
                        flex={flex}
                    />
                ))}
            </div>
            {sortedRows.map((row) => (
                <div key={row.problem_nm} className="border-t flex flex-row h-9 items-baseline last-of-type:border-b">
                    <div className="font-mono text-sm opacity-60 flex flex-row items-center w-12 h-9">
                        {row.problem_nm}
                    </div>
                    <div className="flex flex-row items-baseline h-9 w-22 justify-center">
                        <SharingCell problem={row} className="h-9" />
                    </div>
                    <div className="flex flex-row items-center flex-1">
                        <Link href={`/instructor/problems/${row.problem_nm}/properties`} className="hover:underline">
                            <span className="line-clamp-1">{row.title}</span>
                        </Link>
                        {/* <LanguageBadgeList className="ml-2" problem={row} /> */}
                    </div>
                    <div className="text-sm opacity-60 text-right w-20">{formatDate(row.updated_at)}</div>
                </div>
            ))}
            {sortedRows.length === 0 && (
                <div className="border-t h-12">
                    <div className="h-full flex flex-row justify-center items-center gap-2 opacity-50">
                        <CircleSlash2 className="w-4 h-4" /> No results.
                    </div>
                </div>
            )}
        </div>
    )
}

export default function InstructorProblemTable({ rows }: { rows: ProblemRow[] }) {
    const [showDeprecated, setShowDeprecated] = useState(false)
    const [search, setSearch] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)

    const filteredRows = useMemo(
        () => rows.filter((row) => includesNocaps(row.problem_nm, search) || includesNocaps(row.title, search)),
        [rows, search],
    )

    const onKeyDown = (e: KeyboardEvent) => {
        console.log('Key ', e.key)
        if (e.key === '/') {
            inputRef.current?.focus()
        } else if (e.key === 'Escape') {
            if (inputRef.current) {
                inputRef.current.value = ''
            }
            setSearch('')
        }
    }

    useLayoutEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [])

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center mb-4 print:hidden">
                <Link href="/instructor/problems/new">
                    <Button variant="outline" className="w-36 justify-start" title="Add a new problem">
                        <PlusIcon /> New problem
                    </Button>
                </Link>
                <ExternalLink href="https://github.com/jutge-org/jutge-toolkit">
                    <Button variant="link" className="w-36 justify-start" title="Open Jutge Toolkit website">
                        <WrenchIcon /> Jutge Toolkit
                    </Button>
                </ExternalLink>
                <div className="grow" />
            </div>
            <div className="flex flex-row gap-2 print:hidden">
                <InputGroup>
                    <InputGroupInput
                        ref={inputRef}
                        placeholder="ID or title..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        {search ? 'Press Escape to clear' : "Press '/' to search"}
                    </InputGroupAddon>
                </InputGroup>
                <Label className="text-sm min-w-[20em] flex flex-row justify-end">
                    <Switch checked={showDeprecated} onCheckedChange={(checked) => setShowDeprecated(checked)} />
                    Show deprecated problems
                </Label>
            </div>

            {/* --- Problem Table --- */}
            <Table rows={filteredRows} showDeprecated={showDeprecated} />
            {/* <ComplexTable rows={rows} /> */}

            {/* Blank space */}
            <div className="h-40" />
        </div>
    )
}
