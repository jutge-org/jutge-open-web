import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import type { Download } from '@/lib/jutge_api_client'

export type Dict<T> = Record<string, T>

export function offerDownloadFile(download: Download, filename?: string) {
    const name = filename ?? download.name
    const doc = new Blob([new Uint8Array(download.data)], { type: download.type })
    saveAs(doc, name)
}

export async function file2array(file: File): Promise<Uint8Array> {
    const buffer = await file.arrayBuffer()
    return new Uint8Array(buffer)
}

export function mapmap<V, R>(obj: Record<string, V>, fn: (key: string, value: V) => R): R[] {
    return Object.entries(obj).map(([key, value]) => fn(key, value))
}

export function showError(error: unknown) {
    if (error instanceof Error) {
        const last = error.message[error.message.length - 1]
        toast.error(`Error: ${error.message}${last === '.' ? '' : '.'}`)
    } else {
        toast.error('Error')
    }
}
