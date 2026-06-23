'use client'

const SPREADSHEET_API = '/api/spreadsheet'

export async function array2csv(data: Record<string, unknown>[]): Promise<string> {
    const response = await fetch(SPREADSHEET_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op: 'array2csv', payload: { data } }),
    })
    if (!response.ok) throw new Error('Failed to export CSV')
    const json = (await response.json()) as { result: string }
    return json.result
}

export type CsvRow = Record<string, string>

export async function csv2array(csvString: string): Promise<CsvRow[]> {
    const response = await fetch(SPREADSHEET_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op: 'csv2array', payload: { csvString } }),
    })
    if (!response.ok) throw new Error('Failed to parse CSV')
    const json = (await response.json()) as { result: CsvRow[] }
    return json.result
}

export async function xls2array(xlsBuffer: ArrayBuffer): Promise<Record<string, unknown>[]> {
    const bytes = new Uint8Array(xlsBuffer)
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    const xlsBase64 = btoa(binary)

    const response = await fetch(SPREADSHEET_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op: 'xls2array', payload: { xlsBase64 } }),
    })
    if (!response.ok) throw new Error('Failed to parse spreadsheet')
    const json = (await response.json()) as { result: Record<string, unknown>[] }
    return json.result
}

export async function makeExamPdf(data: { exam_nm: string; extra: string }): Promise<Blob> {
    const response = await fetch('/api/instructor/make-exam-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to generate exam PDF')
    return response.blob()
}
