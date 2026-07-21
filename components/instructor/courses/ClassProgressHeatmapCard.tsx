'use client'

import { SaveFileIconButton } from '@/components/instructor/statistics/SaveFileIconButton'
import { Button } from '@/components/ui/button'
import { CardAction, CardContent, CardHeader, CardTitle, ResizableCard } from '@/components/ResizableCard'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import type { HeatmapAxisItem, HeatmapSourceData } from '@/lib/instructor/courseHeatmapSourceData'
import { parseProblemKey } from '@/lib/problems'
import { VERDICT_COLORS } from '@/lib/statistics/colors'
import { saveFileWithDialog } from '@/lib/saveFileWithDialog'
import { serializeSvgElement } from '@/lib/serializeSvgElement'
import type { CourseSubmission } from '@/lib/jutge_api_client'
import { ChevronDownIcon, CornerUpRightIcon, ImageDownIcon } from 'lucide-react'
import { forwardRef, useMemo, useRef, useState } from 'react'

type CellStatus = 'OK' | 'KO' | 'NT' | 'SC'
type ColumnMode = 'problems' | 'lists'
type StudentLabelMode = 'label' | 'name' | 'email'
type StudentSortField = 'name' | 'email' | 'ok' | 'sc' | 'ko' | 'nt' | 'completion'
type ProblemSortField = 'listOrder' | 'course' | 'problemNm' | 'title' | 'ok' | 'sc' | 'ko' | 'nt' | 'completion'
type ColumnSortField = ProblemSortField

type AxisItem = HeatmapAxisItem

type ListGroup = {
    listNm: string
    listTitle: string
    startIndex: number
    endIndex: number
}

type HeatmapData = {
    rowItems: AxisItem[]
    colItems: AxisItem[]
    cells: CellStatus[][]
    /** Per-cell OK proportion for list columns; null means nothing tried. */
    listProportions?: (number | null)[][]
}

const STATUS_LABELS: Record<CellStatus, string> = {
    OK: 'Accepted',
    KO: 'Rejected',
    SC: 'Scored',
    NT: 'Not tried',
}

const CELL_WIDTH = 11
const CELL_HEIGHT = 14
const CELL_GAP_X = 3
const CELL_GAP_Y = 4
const MIN_LABEL_WIDTH = 44
const MIN_LABEL_HEIGHT = 52
const LIST_BRACKET_BAND = 20
const BRACKET_LEG = 5
const PROBLEM_NM_CHARS = 6
const MIN_ZOOM = 10
const MAX_ZOOM = 200
const DEFAULT_ZOOM = 100

function problemNmFromSubmission(submission: CourseSubmission): string | null {
    const parsed = parseProblemKey(submission.problem_id)
    if (parsed.kind === 'problem_id' || parsed.kind === 'problem_nm') {
        return parsed.problem_nm
    }
    return null
}

function statusFromSubmissions(submissions: CourseSubmission[]): CellStatus {
    if (submissions.length === 0) return 'NT'
    if (submissions.some((submission) => submission.verdict === 'AC')) return 'OK'
    if (submissions.some((submission) => submission.verdict === 'SC')) return 'SC'
    return 'KO'
}

function aggregateListStatus(statuses: CellStatus[]): CellStatus {
    if (statuses.length === 0) return 'NT'
    if (statuses.every((status) => status === 'NT')) return 'NT'
    if (statuses.every((status) => status === 'OK')) return 'OK'
    if (statuses.some((status) => status === 'KO')) return 'KO'
    if (statuses.some((status) => status === 'SC') && statuses.every((status) => status === 'OK' || status === 'SC')) {
        return 'SC'
    }
    return 'KO'
}

function listCellProportion(statuses: CellStatus[]): number | null {
    if (statuses.length === 0 || statuses.every((status) => status === 'NT')) return null
    const okCount = statuses.filter((status) => status === 'OK').length
    return okCount / statuses.length
}

function interpolateRedGreen(proportion: number): string {
    const red = { r: 0xd9, g: 0x53, b: 0x4f }
    const green = { r: 0x5c, g: 0xb8, b: 0x5c }
    const t = Math.max(0, Math.min(1, proportion))
    const r = Math.round(red.r + (green.r - red.r) * t)
    const g = Math.round(red.g + (green.g - red.g) * t)
    const b = Math.round(red.b + (green.b - red.b) * t)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function listCellColor(proportion: number | null): string {
    if (proportion === null) return VERDICT_COLORS.NT
    return interpolateRedGreen(proportion)
}

function buildHeatmapData(
    rowItems: AxisItem[],
    colItems: AxisItem[],
    submissions: CourseSubmission[],
    columnMode: ColumnMode,
): HeatmapData {
    const submissionsByStudentProblem = new Map<string, CourseSubmission[]>()

    for (const submission of submissions) {
        const problem_nm = problemNmFromSubmission(submission)
        if (!problem_nm) continue
        for (const studentKey of [submission.user_uid, submission.email]) {
            const key = `${studentKey}\0${problem_nm}`
            const bucket = submissionsByStudentProblem.get(key) ?? []
            bucket.push(submission)
            submissionsByStudentProblem.set(key, bucket)
        }
    }

    const problemStatus = new Map<string, CellStatus>()
    const problemNms = new Set<string>()
    for (const col of colItems) {
        for (const problem_nm of col.problemNms) {
            problemNms.add(problem_nm)
        }
        if (columnMode === 'problems') {
            problemNms.add(col.key)
        }
    }

    for (const row of rowItems) {
        for (const problem_nm of problemNms) {
            const key = `${row.key}\0${problem_nm}`
            problemStatus.set(key, statusFromSubmissions(submissionsByStudentProblem.get(key) ?? []))
        }
    }

    const cells = rowItems.map((row) =>
        colItems.map((col) => {
            if (columnMode === 'problems') {
                return problemStatus.get(`${row.key}\0${col.key}`) ?? 'NT'
            }

            const statuses = col.problemNms.map((problem_nm) => problemStatus.get(`${row.key}\0${problem_nm}`) ?? 'NT')
            return aggregateListStatus(statuses)
        }),
    )

    const listProportions =
        columnMode === 'lists'
            ? rowItems.map((row) =>
                  colItems.map((col) => {
                      const statuses = col.problemNms.map(
                          (problem_nm) => problemStatus.get(`${row.key}\0${problem_nm}`) ?? 'NT',
                      )
                      return listCellProportion(statuses)
                  }),
              )
            : undefined

    return { rowItems, colItems, cells, listProportions }
}

function countStatuses(statuses: CellStatus[]): Record<CellStatus, number> {
    return statuses.reduce(
        (counts, status) => {
            counts[status] += 1
            return counts
        },
        { OK: 0, KO: 0, NT: 0, SC: 0 },
    )
}

function compareSortValues(a: string | number, b: string | number): number {
    if (typeof a === 'number' && typeof b === 'number') return a - b
    return String(a).localeCompare(String(b))
}

function isDescendingSortField(field: StudentSortField | ColumnSortField): boolean {
    return field === 'ok' || field === 'sc' || field === 'completion'
}

function isOriginalColumnOrder(field: ColumnSortField): boolean {
    return field === 'listOrder' || field === 'course'
}

function sortIndices(
    length: number,
    getValue: (index: number) => string | number,
    field: StudentSortField | ColumnSortField,
): number[] {
    const indices = Array.from({ length }, (_, index) => index)
    if (isOriginalColumnOrder(field as ColumnSortField)) return indices

    const descending = isDescendingSortField(field)
    return indices.sort((left, right) => {
        const result = compareSortValues(getValue(left), getValue(right))
        return descending ? -result : result
    })
}

function sortStudentIndices(data: HeatmapData, field: StudentSortField): number[] {
    return sortIndices(
        data.rowItems.length,
        (index) => {
            const counts = countStatuses(data.cells[index] ?? [])
            const total = data.colItems.length
            const item = data.rowItems[index]!
            switch (field) {
                case 'name':
                    return item.title
                case 'email':
                    return item.subtitle
                case 'ok':
                    return counts.OK
                case 'sc':
                    return counts.SC
                case 'ko':
                    return counts.KO
                case 'nt':
                    return counts.NT
                case 'completion':
                    return total === 0 ? 0 : counts.OK / total
            }
        },
        field,
    )
}

function sortProblemIndices(data: HeatmapData, field: ColumnSortField, columnMode: ColumnMode): number[] {
    return sortIndices(
        data.colItems.length,
        (index) => {
            const counts = countStatuses(data.cells.map((row) => row[index] ?? 'NT'))
            const total = data.rowItems.length
            const item = data.colItems[index]!
            switch (field) {
                case 'listOrder':
                case 'course':
                    return index
                case 'problemNm':
                    return columnMode === 'problems' ? item.key : item.label
                case 'title':
                    return item.title
                case 'ok':
                    return counts.OK
                case 'sc':
                    return counts.SC
                case 'ko':
                    return counts.KO
                case 'nt':
                    return counts.NT
                case 'completion':
                    return total === 0 ? 0 : counts.OK / total
            }
        },
        field,
    )
}

function buildListGroups(items: AxisItem[]): ListGroup[] {
    const groups: ListGroup[] = []
    for (let index = 0; index < items.length; index++) {
        const item = items[index]!
        const listNm = item.listNm
        if (!listNm) continue
        const last = groups[groups.length - 1]
        if (last && last.listNm === listNm) {
            last.endIndex = index
        } else {
            groups.push({
                listNm,
                listTitle: item.listTitle || listNm,
                startIndex: index,
                endIndex: index,
            })
        }
    }
    return groups
}

function truncateWithEllipsis(text: string, maxChars: number): string {
    if (maxChars <= 1 || text.length <= maxChars) return text
    return `${text.slice(0, maxChars - 1)}…`
}

function reorderMatrix(data: HeatmapData, rowOrder: number[], colOrder: number[]): HeatmapData {
    return {
        rowItems: rowOrder.map((index) => data.rowItems[index]!),
        colItems: colOrder.map((index) => data.colItems[index]!),
        cells: rowOrder.map((rowIndex) => colOrder.map((colIndex) => data.cells[rowIndex]![colIndex]!)),
        listProportions: data.listProportions
            ? rowOrder.map((rowIndex) => colOrder.map((colIndex) => data.listProportions![rowIndex]![colIndex]!))
            : undefined,
    }
}

function transposeMatrix(data: HeatmapData): HeatmapData {
    return {
        rowItems: data.colItems,
        colItems: data.rowItems,
        cells: data.colItems.map((_, colIndex) => data.rowItems.map((_, rowIndex) => data.cells[rowIndex]![colIndex]!)),
        listProportions: data.listProportions
            ? data.colItems.map((_, colIndex) =>
                  data.rowItems.map((_, rowIndex) => data.listProportions![rowIndex]![colIndex]!),
              )
            : undefined,
    }
}

function isStudentAxisItem(item: AxisItem): boolean {
    return !item.listNm && item.problemNms.length === 0
}

function studentDisplayLabel(item: AxisItem, mode: StudentLabelMode): string {
    if (!isStudentAxisItem(item)) return item.label
    switch (mode) {
        case 'name':
            return item.title
        case 'email':
            return item.subtitle
        case 'label':
            return item.label
    }
}

function withStudentDisplayLabels(data: HeatmapData, mode: StudentLabelMode): HeatmapData {
    const relabel = (item: AxisItem): AxisItem =>
        isStudentAxisItem(item) ? { ...item, label: studentDisplayLabel(item, mode) } : item

    return {
        ...data,
        rowItems: data.rowItems.map(relabel),
        colItems: data.colItems.map(relabel),
    }
}

function estimateTextWidth(text: string, fontSize: number): number {
    return text.length * fontSize * 0.62
}

function measureRowLabelWidth(rowItems: AxisItem[], scaleY: number): number {
    const fontSize = 10 * scaleY
    const longest = rowItems.reduce((max, item) => Math.max(max, item.label.length), 0)
    return Math.max(MIN_LABEL_WIDTH * scaleY, estimateTextWidth('0'.repeat(longest), fontSize) + 12 * scaleY)
}

function measureColLabelHeight(colItems: AxisItem[], scaleX: number, scaleY: number, bracketBand = 0): number {
    const fontSize = 10 * scaleX
    let maxHeight = MIN_LABEL_HEIGHT * scaleY
    for (const item of colItems) {
        const textWidth = estimateTextWidth(item.label, fontSize)
        const heightNeeded = textWidth * Math.SQRT1_2 + 12 * scaleY
        maxHeight = Math.max(maxHeight, heightNeeded)
    }
    return maxHeight + bracketBand
}

function measureProblemColLabelRise(fontSize: number, scaleY: number): number {
    const textWidth = estimateTextWidth('0'.repeat(PROBLEM_NM_CHARS), fontSize)
    return textWidth * Math.SQRT1_2 + 2 * scaleY
}

const STUDENT_LABEL_MODE_LABELS: Record<StudentLabelMode, string> = {
    label: 'Label (S*)',
    name: 'Name',
    email: 'Email',
}

const STUDENT_SORT_LABELS: Record<StudentSortField, string> = {
    name: 'Name',
    email: 'Email',
    ok: 'OK count',
    sc: 'SC count',
    ko: 'KO count',
    nt: 'NT count',
    completion: 'Completion',
}

const PROBLEM_SORT_LABELS: Record<ProblemSortField, string> = {
    listOrder: 'List order',
    course: 'Course',
    problemNm: 'Name (problem_nm)',
    title: 'Title',
    ok: 'OK count',
    sc: 'SC count',
    ko: 'KO count',
    nt: 'NT count',
    completion: 'Completion',
}

const PROBLEM_COLUMN_SORT_FIELDS: ProblemSortField[] = [
    'listOrder',
    'problemNm',
    'title',
    'ok',
    'sc',
    'ko',
    'nt',
    'completion',
]

const LIST_COLUMN_SORT_FIELDS: ColumnSortField[] = [
    'course',
    'problemNm',
    'title',
    'ok',
    'sc',
    'ko',
    'nt',
    'completion',
]

function columnSortFields(columnMode: ColumnMode): ColumnSortField[] {
    return columnMode === 'lists' ? LIST_COLUMN_SORT_FIELDS : PROBLEM_COLUMN_SORT_FIELDS
}

function columnSortOptionLabel(field: ColumnSortField, nameSortLabel: string): string {
    if (field === 'problemNm') return nameSortLabel
    return PROBLEM_SORT_LABELS[field]
}

type HeatmapSvgProps = {
    rowItems: AxisItem[]
    colItems: AxisItem[]
    cells: CellStatus[][]
    listProportions?: (number | null)[][]
    columnMode: ColumnMode
    zoomX: number
    zoomY: number
    listGroups?: ListGroup[]
    bracketPosition?: 'top' | 'left'
    ariaLabel: string
}

function formatListProportion(proportion: number | null, problemCount: number): string {
    if (proportion === null) return 'Not tried'
    const solved = Math.round(proportion * problemCount)
    const pct = Math.round(proportion * 100)
    return `${solved}/${problemCount} solved (${pct}%)`
}

const HeatmapSvg = forwardRef<SVGSVGElement, HeatmapSvgProps>(function HeatmapSvg(
    {
        rowItems,
        colItems,
        cells,
        listProportions,
        columnMode,
        zoomX,
        zoomY,
        listGroups = [],
        bracketPosition,
        ariaLabel,
    },
    ref,
) {
    const scaleX = zoomX / 100
    const scaleY = zoomY / 100
    const cellWidth = CELL_WIDTH * scaleX
    const cellHeight = CELL_HEIGHT * scaleY
    const gapX = CELL_GAP_X * scaleX
    const gapY = CELL_GAP_Y * scaleY
    const rowFontSize = 10 * scaleY
    const colFontSize = 10 * scaleX
    const showTopBrackets = bracketPosition === 'top' && listGroups.length > 0
    const showLeftBrackets = bracketPosition === 'left' && listGroups.length > 0
    const bracketFontSize = 9 * Math.min(scaleX, scaleY)
    const leftBracketBand = showLeftBrackets ? LIST_BRACKET_BAND * scaleX : 0
    const rowLabelWidth = measureRowLabelWidth(rowItems, scaleY)
    const gridLeft = leftBracketBand + rowLabelWidth
    const problemLabelRise = showTopBrackets ? measureProblemColLabelRise(colFontSize, scaleY) : 0
    const bracketTop = showTopBrackets ? bracketFontSize + 3 * scaleY : 0
    const bracketBottom = showTopBrackets ? bracketTop + BRACKET_LEG * scaleY : 0
    const colLabelY = showTopBrackets ? bracketBottom + 2 * scaleY + problemLabelRise : 0
    const gridTop = showTopBrackets ? colLabelY + 2 * scaleY : measureColLabelHeight(colItems, scaleX, scaleY)
    const width = gridLeft + colItems.length * cellWidth + Math.max(0, colItems.length - 1) * gapX
    const height = gridTop + rowItems.length * cellHeight + Math.max(0, rowItems.length - 1) * gapY
    const cellRadius = 2 * Math.min(scaleX, scaleY)

    function columnSpan(index: number) {
        const x = gridLeft + index * (cellWidth + gapX)
        return { start: x, center: x + cellWidth / 2, end: x + cellWidth }
    }

    function columnGroupSpan(startIndex: number, endIndex: number) {
        const start = columnSpan(startIndex).start - (startIndex > 0 ? gapX / 2 : 0)
        const end = columnSpan(endIndex).end + (endIndex < colItems.length - 1 ? gapX / 2 : 0)
        return { start, end, mid: (start + end) / 2 }
    }

    function rowSpan(index: number) {
        const y = gridTop + index * (cellHeight + gapY)
        return { start: y, center: y + cellHeight / 2, end: y + cellHeight }
    }

    return (
        <svg
            ref={ref}
            width={width}
            height={height}
            role="img"
            aria-label={ariaLabel}
            className="overflow-visible text-foreground"
        >
            {showTopBrackets
                ? listGroups.map((group) => {
                      const { start: startX, end: endX, mid: midX } = columnGroupSpan(group.startIndex, group.endIndex)
                      const maxChars = Math.max(2, Math.floor((endX - startX) / (bracketFontSize * 0.55)))
                      const label = truncateWithEllipsis(group.listTitle, maxChars)
                      return (
                          <g key={`list-top-${group.listNm}-${group.startIndex}`}>
                              <path
                                  d={`M ${startX} ${bracketBottom} L ${startX} ${bracketTop} L ${endX} ${bracketTop} L ${endX} ${bracketBottom}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1}
                                  opacity={0.55}
                              />
                              <text
                                  x={midX}
                                  y={bracketTop - 3 * scaleY}
                                  textAnchor="middle"
                                  dominantBaseline="auto"
                                  fontSize={bracketFontSize}
                                  className="fill-current"
                                  opacity={0.85}
                              >
                                  <title>{group.listTitle}</title>
                                  {label}
                              </text>
                          </g>
                      )
                  })
                : null}

            {showLeftBrackets
                ? listGroups.map((group) => {
                      const startY = rowSpan(group.startIndex).start
                      const endY = rowSpan(group.endIndex).end
                      const midY = (startY + endY) / 2
                      const bracketLeft = 4 * scaleX
                      const bracketRight = leftBracketBand - 4 * scaleX
                      const maxChars = Math.max(2, Math.floor((endY - startY) / (bracketFontSize * 0.55)))
                      const label = truncateWithEllipsis(group.listTitle, maxChars)
                      return (
                          <g key={`list-left-${group.listNm}-${group.startIndex}`}>
                              <path
                                  d={`M ${bracketRight} ${startY} L ${bracketLeft} ${startY} L ${bracketLeft} ${endY} L ${bracketRight} ${endY}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1}
                                  opacity={0.55}
                              />
                              <text
                                  x={bracketLeft - 2 * scaleX}
                                  y={midY}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fontSize={bracketFontSize}
                                  className="fill-current"
                                  opacity={0.85}
                                  transform={`rotate(-90, ${bracketLeft - 2 * scaleX}, ${midY})`}
                              >
                                  <title>{group.listTitle}</title>
                                  {label}
                              </text>
                          </g>
                      )
                  })
                : null}

            {rowItems.map((row, rowIndex) => {
                const y = gridTop + rowIndex * (cellHeight + gapY)
                return (
                    <text
                        key={`row-${row.key}`}
                        x={gridLeft - 6 * scaleX}
                        y={y + cellHeight / 2}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize={rowFontSize}
                        className="fill-current"
                    >
                        <title>{`${row.label}: ${row.title} (${row.subtitle})`}</title>
                        {row.label}
                    </text>
                )
            })}

            {colItems.map((col, colIndex) => {
                const x = gridLeft + colIndex * (cellWidth + gapX)
                const labelY = showTopBrackets ? colLabelY : gridTop - 2 * scaleY
                return (
                    <text
                        key={`col-${col.key}`}
                        x={x}
                        y={labelY}
                        textAnchor="start"
                        dominantBaseline="auto"
                        fontSize={colFontSize}
                        className="fill-current"
                        transform={`rotate(-45, ${x}, ${labelY})`}
                    >
                        <title>{`${col.label}: ${col.title} (${col.subtitle})`}</title>
                        {col.label}
                    </text>
                )
            })}

            {cells.map((row, rowIndex) =>
                row.map((status, colIndex) => {
                    const x = gridLeft + colIndex * (cellWidth + gapX)
                    const y = gridTop + rowIndex * (cellHeight + gapY)
                    const rowItem = rowItems[rowIndex]!
                    const colItem = colItems[colIndex]!
                    const proportion = listProportions?.[rowIndex]?.[colIndex] ?? null
                    const useListColors = columnMode === 'lists' && listProportions !== undefined
                    const fill = useListColors ? listCellColor(proportion) : VERDICT_COLORS[status]
                    const opacity = useListColors ? (proportion === null ? 0.35 : 1) : status === 'NT' ? 0.35 : 1
                    const statusLine = useListColors
                        ? formatListProportion(proportion, colItem.problemNms.length)
                        : `Status: ${STATUS_LABELS[status]} (${status})`
                    const tooltip = [
                        `${rowItem.label}: ${rowItem.title}`,
                        rowItem.subtitle,
                        `${colItem.label}: ${colItem.title}`,
                        colItem.subtitle,
                        statusLine,
                    ].join('\n')

                    return (
                        <rect
                            key={`${rowIndex}-${colIndex}`}
                            x={x}
                            y={y}
                            width={cellWidth}
                            height={cellHeight}
                            rx={cellRadius}
                            fill={fill}
                            stroke={fill}
                            strokeWidth={0}
                            opacity={opacity}
                        >
                            <title>{tooltip}</title>
                        </rect>
                    )
                }),
            )}
        </svg>
    )
})

function StatusLegend() {
    const statuses: CellStatus[] = ['OK', 'KO', 'SC', 'NT']
    return (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {statuses.map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                    <span
                        className={`inline-block size-3 rounded-sm ${status === 'NT' ? '' : 'border border-border'}`}
                        style={{ backgroundColor: VERDICT_COLORS[status], opacity: status === 'NT' ? 0.35 : 1 }}
                        aria-hidden
                    />
                    <span>
                        {status} — {STATUS_LABELS[status]}
                    </span>
                </div>
            ))}
        </div>
    )
}

function ListCompletionLegend() {
    return (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
                <span
                    className="inline-block size-3 rounded-sm"
                    style={{ backgroundColor: VERDICT_COLORS.NT, opacity: 0.35 }}
                    aria-hidden
                />
                <span>Not tried</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span
                    className="inline-block h-3 w-16 rounded-sm border border-border"
                    style={{
                        background: `linear-gradient(to right, ${VERDICT_COLORS.KO}, ${VERDICT_COLORS.OK})`,
                    }}
                    aria-hidden
                />
                <span>0% → 100% accepted</span>
            </div>
        </div>
    )
}

type ListFilterOption = {
    listNm: string
    listTitle: string
}

function buildListFilterOptions(listColumns: AxisItem[]): ListFilterOption[] {
    return listColumns.map((column) => ({
        listNm: column.listNm,
        listTitle: column.listTitle || column.listNm,
    }))
}

function listFilterTriggerLabel(selectedCount: number, totalCount: number): string {
    if (selectedCount === totalCount) return `${totalCount} lists`
    return `${selectedCount}/${totalCount} lists`
}

type ListFilterDropdownProps = {
    options: ListFilterOption[]
    selectedListNms: string[]
    onSelectedListNmsChange: (listNms: string[]) => void
}

type StudentLabelDropdownProps = {
    mode: StudentLabelMode
    onModeChange: (mode: StudentLabelMode) => void
}

function StudentLabelDropdown({ mode, onModeChange }: StudentLabelDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-44 justify-between px-3 font-normal"
                    aria-label="Show students by"
                >
                    <span className="truncate">{STUDENT_LABEL_MODE_LABELS[mode]}</span>
                    <ChevronDownIcon className="size-4 shrink-0 opacity-50" aria-hidden />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuLabel>Show students by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={mode} onValueChange={(value) => onModeChange(value as StudentLabelMode)}>
                    {(Object.keys(STUDENT_LABEL_MODE_LABELS) as StudentLabelMode[]).map((option) => (
                        <DropdownMenuRadioItem key={option} value={option}>
                            {STUDENT_LABEL_MODE_LABELS[option]}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function ListFilterDropdown({ options, selectedListNms, onSelectedListNmsChange }: ListFilterDropdownProps) {
    const selectedSet = new Set(selectedListNms)

    function toggleList(listNm: string, checked: boolean) {
        if (checked) {
            onSelectedListNmsChange([...new Set([...selectedListNms, listNm])])
            return
        }
        onSelectedListNmsChange(selectedListNms.filter((value) => value !== listNm))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-52 justify-between px-3 font-normal"
                    aria-label="Filter lists"
                >
                    <span className="truncate">{listFilterTriggerLabel(selectedListNms.length, options.length)}</span>
                    <ChevronDownIcon className="size-4 shrink-0 opacity-50" aria-hidden />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Lists</DropdownMenuLabel>
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.listNm}
                        checked={selectedSet.has(option.listNm)}
                        onCheckedChange={(checked) => toggleList(option.listNm, checked === true)}
                        onSelect={(event) => event.preventDefault()}
                    >
                        {option.listTitle}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type ClassProgressHeatmapCardBaseProps = {
    title: string
    columnMode: ColumnMode
    ariaLabel: string
    columnSortLabel: string
    columnSortAriaLabel: string
    nameSortLabel: string
    defaultColumnSort?: ColumnSortField
    defaultTransposed?: boolean
    scrollAreaClassName?: string
    showListFilter?: boolean
    saveFileName: string
} & HeatmapSourceData

function ClassProgressHeatmapCardBase({
    title,
    columnMode,
    ariaLabel,
    columnSortLabel,
    columnSortAriaLabel,
    nameSortLabel,
    defaultColumnSort,
    defaultTransposed = false,
    scrollAreaClassName = 'h-[min(70vh,640px)]',
    showListFilter = false,
    saveFileName,
    submissions,
    students,
    problemColumns,
    listColumns,
}: ClassProgressHeatmapCardBaseProps) {
    const [transposed, setTransposed] = useState(defaultTransposed)
    const [studentLabelMode, setStudentLabelMode] = useState<StudentLabelMode>('label')
    const [studentSort, setStudentSort] = useState<StudentSortField>('name')
    const [columnSort, setColumnSort] = useState<ColumnSortField>(
        defaultColumnSort ?? (columnMode === 'lists' ? 'course' : 'listOrder'),
    )
    const [listFilter, setListFilter] = useState<string[] | null>(null)
    const [zoomX, setZoomX] = useState(DEFAULT_ZOOM)
    const [zoomY, setZoomY] = useState(DEFAULT_ZOOM)
    const exportSvgRef = useRef<SVGSVGElement>(null)

    const listFilterOptions = useMemo(
        () => (showListFilter ? buildListFilterOptions(listColumns) : []),
        [listColumns, showListFilter],
    )

    const allListNms = useMemo(() => listFilterOptions.map((option) => option.listNm), [listFilterOptions])
    const selectedListNms = listFilter ?? allListNms

    const filteredProblemColumns = useMemo(() => {
        if (!showListFilter) return problemColumns
        const selected = new Set(selectedListNms)
        return problemColumns.filter((column) => selected.has(column.listNm))
    }, [problemColumns, selectedListNms, showListFilter])

    const baseData = useMemo(() => {
        const colItems = columnMode === 'problems' ? filteredProblemColumns : listColumns
        return buildHeatmapData(students, colItems, submissions, columnMode)
    }, [students, filteredProblemColumns, listColumns, submissions, columnMode])

    const sortedData = useMemo(() => {
        const studentOrder = sortStudentIndices(baseData, studentSort)
        const problemOrder = sortProblemIndices(baseData, columnSort, columnMode)
        const ordered = reorderMatrix(baseData, studentOrder, problemOrder)
        return transposed ? transposeMatrix(ordered) : ordered
    }, [baseData, studentSort, columnSort, columnMode, transposed])

    const showListBrackets = columnMode === 'problems' && columnSort === 'listOrder'
    const listGroups = useMemo(() => {
        if (!showListBrackets) return []
        const problemAxisItems = transposed ? sortedData.rowItems : sortedData.colItems
        return buildListGroups(problemAxisItems)
    }, [showListBrackets, transposed, sortedData.rowItems, sortedData.colItems])
    const bracketPosition = transposed ? 'left' : 'top'

    const displayData = useMemo(
        () => withStudentDisplayLabels(sortedData, studentLabelMode),
        [sortedData, studentLabelMode],
    )

    const isEmpty = sortedData.rowItems.length === 0 || sortedData.colItems.length === 0

    async function saveSvgHandle() {
        const svg = exportSvgRef.current
        if (!svg) return

        const svgText = serializeSvgElement(svg)
        const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
        await saveFileWithDialog({
            blob,
            suggestedName: saveFileName,
            types: [{ description: 'SVG image', accept: { 'image/svg+xml': ['.svg'] } }],
        })
    }

    return (
        <ResizableCard defaultHeight={420}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardAction>
                    <TooltipProvider>
                        <SaveFileIconButton
                            onClick={saveSvgHandle}
                            disabled={isEmpty}
                            tooltip="Save heatmap as SVG"
                            aria-label="Save heatmap as SVG"
                            icon={ImageDownIcon}
                        />
                    </TooltipProvider>
                </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Show students</span>
                        <StudentLabelDropdown mode={studentLabelMode} onModeChange={setStudentLabelMode} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Sort students</span>
                        <Select
                            value={studentSort}
                            onValueChange={(value) => setStudentSort(value as StudentSortField)}
                        >
                            <SelectTrigger className="h-8 w-44" aria-label="Sort students">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(Object.keys(STUDENT_SORT_LABELS) as StudentSortField[]).map((field) => (
                                    <SelectItem key={field} value={field}>
                                        {STUDENT_SORT_LABELS[field]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{columnSortLabel}</span>
                        <Select value={columnSort} onValueChange={(value) => setColumnSort(value as ColumnSortField)}>
                            <SelectTrigger className="h-8 w-44" aria-label={columnSortAriaLabel}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {columnSortFields(columnMode).map((field) => (
                                    <SelectItem key={field} value={field}>
                                        {columnSortOptionLabel(field, nameSortLabel)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {showListFilter && listFilterOptions.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Filter lists</span>
                            <ListFilterDropdown
                                options={listFilterOptions}
                                selectedListNms={selectedListNms}
                                onSelectedListNmsChange={setListFilter}
                            />
                        </div>
                    ) : null}
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <span className="shrink-0 text-xs text-muted-foreground -mr-4">transpose</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    onClick={() => setTransposed((value) => !value)}
                                    aria-label="Transpose matrix"
                                >
                                    <CornerUpRightIcon className="size-4" aria-hidden />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Transpose matrix</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs text-muted-foreground">h-zoom</span>
                        <Slider
                            min={MIN_ZOOM}
                            max={MAX_ZOOM}
                            step={5}
                            value={[zoomX]}
                            onValueChange={(value) => setZoomX(value[0] ?? DEFAULT_ZOOM)}
                            aria-label="Horizontal zoom"
                            className="w-24"
                        />
                        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                            {zoomX}%
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs text-muted-foreground">v-zoom</span>
                        <Slider
                            min={MIN_ZOOM}
                            max={MAX_ZOOM}
                            step={5}
                            value={[zoomY]}
                            onValueChange={(value) => setZoomY(value[0] ?? DEFAULT_ZOOM)}
                            aria-label="Vertical zoom"
                            className="w-24"
                        />
                        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                            {zoomY}%
                        </span>
                    </div>
                </div>
                {columnMode === 'lists' ? <ListCompletionLegend /> : <StatusLegend />}
                {isEmpty ? (
                    <p className="text-sm text-muted-foreground">No students or columns to display.</p>
                ) : (
                    <div
                        className={`${scrollAreaClassName} w-full overflow-auto rounded-md border border-border p-3 pt-4`}
                    >
                        <HeatmapSvg
                            rowItems={displayData.rowItems}
                            colItems={displayData.colItems}
                            cells={displayData.cells}
                            listProportions={displayData.listProportions}
                            columnMode={columnMode}
                            zoomX={zoomX}
                            zoomY={zoomY}
                            listGroups={listGroups}
                            bracketPosition={showListBrackets ? bracketPosition : undefined}
                            ariaLabel={ariaLabel}
                        />
                        <div aria-hidden className="pointer-events-none fixed -left-[10000px] top-0 opacity-0">
                            <HeatmapSvg
                                ref={exportSvgRef}
                                rowItems={displayData.rowItems}
                                colItems={displayData.colItems}
                                cells={displayData.cells}
                                listProportions={displayData.listProportions}
                                columnMode={columnMode}
                                zoomX={zoomX}
                                zoomY={zoomY}
                                listGroups={listGroups}
                                bracketPosition={showListBrackets ? bracketPosition : undefined}
                                ariaLabel={ariaLabel}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </ResizableCard>
    )
}

type ClassProgressHeatmapCardsProps = {
    course_nm: string
    heatmap: HeatmapSourceData
}

export function ClassProgressHeatmapCards({ course_nm, heatmap }: ClassProgressHeatmapCardsProps) {
    return (
        <>
            <ClassProgressHeatmapCardBase
                title="Class progress heatmap by problems"
                columnMode="problems"
                ariaLabel="Class progress heatmap by problems"
                columnSortLabel="Sort problems"
                columnSortAriaLabel="Sort problems"
                nameSortLabel="Name (problem_nm)"
                showListFilter
                saveFileName={`${course_nm}-class-progress-by-problems.svg`}
                {...heatmap}
            />
            <ClassProgressHeatmapCardBase
                title="Class progress heatmap by lists"
                columnMode="lists"
                ariaLabel="Class progress heatmap by lists"
                columnSortLabel="Sort lists"
                columnSortAriaLabel="Sort lists"
                nameSortLabel="Name (list_nm)"
                defaultColumnSort="course"
                defaultTransposed
                saveFileName={`${course_nm}-class-progress-by-lists.svg`}
                {...heatmap}
            />
        </>
    )
}
