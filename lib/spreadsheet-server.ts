import { writeToString } from '@fast-csv/format'
import { parseString } from '@fast-csv/parse'
import { sleep } from 'radash'
import { read, utils } from 'xlsx'

export async function array2csv(data: Record<string, unknown>[]) {
    await sleep(0)
    return await writeToString(data, {
        headers: true,
        delimiter: ',',
        quoteColumns: true,
    })
}

export interface CsvRow {
    [key: string]: string
}

function parse(csvString: string): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
        const results: CsvRow[] = []

        parseString(csvString, {
            headers: true,
            delimiter: ';',
        })
            .on('data', (row: CsvRow) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', (error: Error) => reject(error))
    })
}

export async function csv2array(csvString: string): Promise<CsvRow[]> {
    return await parse(csvString)
}

export async function xls2array(xlsBuffer: ArrayBuffer): Promise<Record<string, unknown>[]> {
    await sleep(0)
    const workbook = read(xlsBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = utils.sheet_to_json(worksheet)

    return data.map((row) => {
        const plainRow: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(row as Record<string, unknown>)) {
            plainRow[key] = value
        }
        return plainRow
    })
}
