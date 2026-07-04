import { array2csv } from '@/actions/instructor/csv'
import { saveFileWithDialog } from '@/lib/saveFileWithDialog'
import { serializeSvgElement } from '@/lib/serializeSvgElement'
import { toast } from 'sonner'

export async function saveStatisticsCsv(
    records: Record<string, unknown>[],
    suggestedName: string,
): Promise<void> {
    const csv = await array2csv(records)
    if (!csv) {
        toast.error('Error preparing CSV data')
        return
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    await saveFileWithDialog({
        blob,
        suggestedName,
        types: [{ description: 'CSV file', accept: { 'text/csv': ['.csv'] } }],
    })
}

export async function saveStatisticsSvg(
    svg: SVGSVGElement | null | undefined,
    suggestedName: string,
): Promise<void> {
    if (!svg) return

    const svgText = serializeSvgElement(svg)
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
    await saveFileWithDialog({
        blob,
        suggestedName,
        types: [{ description: 'SVG image', accept: { 'image/svg+xml': ['.svg'] } }],
    })
}
