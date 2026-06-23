import { NextResponse } from 'next/server'
import { z } from 'zod'

import { array2csv, csv2array, xls2array } from '@/lib/spreadsheet-server'

const zSpreadsheetRequest = z.discriminatedUnion('op', [
    z.object({
        op: z.literal('array2csv'),
        payload: z.object({ data: z.array(z.record(z.string(), z.unknown())) }),
    }),
    z.object({
        op: z.literal('csv2array'),
        payload: z.object({ csvString: z.string() }),
    }),
    z.object({
        op: z.literal('xls2array'),
        payload: z.object({ xlsBase64: z.string() }),
    }),
])

export async function POST(request: Request) {
    try {
        const body = zSpreadsheetRequest.parse(await request.json())

        switch (body.op) {
            case 'array2csv':
                return NextResponse.json({ result: await array2csv(body.payload.data) })
            case 'csv2array':
                return NextResponse.json({ result: await csv2array(body.payload.csvString) })
            case 'xls2array': {
                const binary = Buffer.from(body.payload.xlsBase64, 'base64')
                const arrayBuffer = binary.buffer.slice(
                    binary.byteOffset,
                    binary.byteOffset + binary.byteLength,
                )
                return NextResponse.json({ result: await xls2array(arrayBuffer) })
            }
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Spreadsheet operation failed'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
