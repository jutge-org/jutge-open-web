import { saveAs } from 'file-saver'

type SaveFilePickerAcceptType = {
    description: string
    accept: Record<string, string[]>
}

type SaveFileWithDialogOptions = {
    blob: Blob
    suggestedName: string
    types?: SaveFilePickerAcceptType[]
}

type WindowWithSaveFilePicker = Window &
    typeof globalThis & {
        showSaveFilePicker?: (options?: {
            suggestedName?: string
            types?: SaveFilePickerAcceptType[]
        }) => Promise<FileSystemFileHandle>
    }

export async function saveFileWithDialog({ blob, suggestedName, types }: SaveFileWithDialogOptions): Promise<void> {
    const savePicker = (window as WindowWithSaveFilePicker).showSaveFilePicker
    if (savePicker) {
        try {
            const handle = await savePicker({ suggestedName, types })
            const writable = await handle.createWritable()
            await writable.write(blob)
            await writable.close()
            return
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return
            }
        }
    }

    saveAs(blob, suggestedName)
}
