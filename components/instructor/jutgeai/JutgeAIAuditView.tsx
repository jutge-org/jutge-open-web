'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import { AgTableFull } from '@/components/administrator/AgTable'
import { llmEstimates } from '@/lib/ai-utils'
import type { LlmUsageEntry } from '@/lib/jutge_api_client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useMemo, useState } from 'react'

dayjs.extend(duration)

function formatDuration(seconds: number): string {
    const d = dayjs.duration(Math.round(seconds), 'seconds')
    const h = Math.floor(d.asHours())
    const m = d.minutes()
    const s = d.seconds()
    const parts: string[] = []
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    if (s > 0 || parts.length === 0) parts.push(`${s}s`)
    return parts.join(' ')
}

type ModelAuditRow = {
    model: string
    total_duration: number
    total_tokens_in: number
    total_tokens_out: number
    interactions: number
    priceEur?: number
    wattHours?: number
    co2Grams?: number
    isTotal?: boolean
}

function totalsRow(rows: ModelAuditRow[]): ModelAuditRow | null {
    if (rows.length === 0) return null
    return {
        model: 'Total',
        total_duration: rows.reduce((s, r) => s + r.total_duration, 0),
        total_tokens_in: rows.reduce((s, r) => s + r.total_tokens_in, 0),
        total_tokens_out: rows.reduce((s, r) => s + r.total_tokens_out, 0),
        interactions: rows.reduce((s, r) => s + r.interactions, 0),
        priceEur: rows.reduce((s, r) => s + (r.priceEur ?? 0), 0) || undefined,
        wattHours: rows.reduce((s, r) => s + (r.wattHours ?? 0), 0) || undefined,
        co2Grams: rows.reduce((s, r) => s + (r.co2Grams ?? 0), 0) || undefined,
        isTotal: true,
    }
}

function aggregateByModel(entries: LlmUsageEntry[]): ModelAuditRow[] {
    const byModel = new Map<string, ModelAuditRow>()
    for (const e of entries) {
        const existing = byModel.get(e.model)
        if (existing) {
            existing.total_duration += Number(e.duration)
            existing.total_tokens_in += Number(e.input_tokens)
            existing.total_tokens_out += Number(e.output_tokens)
            existing.interactions += 1
        } else {
            byModel.set(e.model, {
                model: e.model,
                total_duration: Number(e.duration),
                total_tokens_in: Number(e.input_tokens),
                total_tokens_out: Number(e.output_tokens),
                interactions: 1,
            })
        }
    }
    return Array.from(byModel.values()).sort((a, b) => a.model.localeCompare(b.model))
}

async function enrichRowWithEstimates(row: ModelAuditRow): Promise<ModelAuditRow> {
    try {
        const est = await llmEstimates(row.total_tokens_in, row.total_tokens_out, row.model)
        return {
            ...row,
            priceEur: est.priceEurTax,
            wattHours: est.wattHours,
            co2Grams: est.co2Grams,
        }
    } catch {
        return row
    }
}

export function JutgeAIAuditView() {
    const { client } = useJutgeAuth()

    const [entries, setEntries] = useState<LlmUsageEntry[]>([])
    const baseRows = useMemo(() => aggregateByModel(entries), [entries])
    const [rows, setRows] = useState<ModelAuditRow[]>([])

    useEffect(() => {
        setRows(baseRows)
        if (baseRows.length === 0) return
        let cancelled = false
        Promise.all(baseRows.map(enrichRowWithEstimates)).then((enriched) => {
            if (!cancelled) setRows(enriched)
        })
        return () => {
            cancelled = true
        }
    }, [baseRows])

    useEffect(() => {
        async function fetchEntries() {
    const { client } = useJutgeAuth()

            const data = await client.instructor.jutgeai.getLlmUsage()
            setEntries(data)
        }
        fetchEntries()
    }, [])

    const colDefs = [
        { field: 'model', flex: 2, filter: true },
        {
            field: 'total_duration',
            headerName: 'Total duration',
            width: 140,
            filter: false,
            type: 'rightAligned',
            valueFormatter: (p: { data: ModelAuditRow }) => formatDuration(Number(p.data.total_duration)),
        },
        {
            field: 'total_tokens_in',
            headerName: 'Tokens in',
            width: 120,
            filter: false,
            type: 'rightAligned',
        },
        {
            field: 'total_tokens_out',
            headerName: 'Tokens out',
            width: 120,
            filter: false,
            type: 'rightAligned',
        },
        {
            field: 'interactions',
            headerName: 'Interactions',
            width: 120,
            filter: false,
            type: 'rightAligned',
        },
        {
            field: 'priceEur',
            headerName: 'Price (€)',
            width: 110,
            filter: false,
            type: 'rightAligned',
            valueFormatter: (p: { data: ModelAuditRow }) =>
                p.data.priceEur != null ? `${Number(p.data.priceEur).toFixed(2)}` : '—',
        },
        {
            field: 'wattHours',
            headerName: 'Power (Wh)',
            width: 110,
            filter: false,
            type: 'rightAligned',
            valueFormatter: (p: { data: ModelAuditRow }) =>
                p.data.wattHours != null ? Number(p.data.wattHours).toFixed(2) : '—',
        },
        {
            field: 'co2Grams',
            headerName: 'CO₂ (g)',
            width: 110,
            filter: false,
            type: 'rightAligned',
            valueFormatter: (p: { data: ModelAuditRow }) =>
                p.data.co2Grams != null ? Number(p.data.co2Grams).toFixed(1) : '—',
        },
    ]

    const totalRow = totalsRow(rows)
    const displayRows = totalRow ? [totalRow, ...rows] : rows

    return (
        <>
            <AgTableFull
                rowData={displayRows}
                columnDefs={colDefs}
                getRowClass={(params: { data?: ModelAuditRow }) =>
                    params.data?.isTotal ? 'jutgeai-audit-total-row' : ''
                }
            />
            <div className="mt-4 flex flex-row gap-2">
                <div className="text-sm">
                    Price, power and emissions are estimations derived from tokens and models.
                </div>
                <div className="flex-grow" />
            </div>
        </>
    )
}
