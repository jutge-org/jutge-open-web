import { monacoLanguageForExtension } from '@/lib/highlightCode'
import { objectToYaml } from '@/lib/highlightYaml'
import type { DebugInformation } from '@/lib/jutge_api_client'

export type DebugInformationFieldKind = 'yaml' | 'text'

export type DebugInformationField = {
    key: keyof DebugInformation
    label: string
    kind: DebugInformationFieldKind
    extension: 'yml' | 'txt'
    filename: string
    content: string
    language: string
}

const DEBUG_FIELD_DEFINITIONS: {
    key: keyof DebugInformation
    label: string
    kind: DebugInformationFieldKind
    extension: 'yml' | 'txt'
}[] = [
    { key: 'correction', label: 'Correction', kind: 'yaml', extension: 'yml' },
    { key: 'solution', label: 'Solution', kind: 'yaml', extension: 'yml' },
    { key: 'stderr', label: 'stderr', kind: 'text', extension: 'txt' },
    { key: 'stdout', label: 'stdout', kind: 'text', extension: 'txt' },
    { key: 'directories', label: 'Directories', kind: 'yaml', extension: 'yml' },
]

function languageForExtension(extension: 'yml' | 'txt'): string {
    return monacoLanguageForExtension(extension) ?? (extension === 'yml' ? 'yaml' : 'plaintext')
}

export function getDebugInformationFields(data: DebugInformation): DebugInformationField[] {
    const fields: DebugInformationField[] = []

    for (const field of DEBUG_FIELD_DEFINITIONS) {
        const value = data[field.key]
        if (value == null) {
            continue
        }

        const content = field.kind === 'yaml' ? objectToYaml(value) : typeof value === 'string' ? value : String(value)

        fields.push({
            key: field.key,
            label: field.label,
            kind: field.kind,
            extension: field.extension,
            filename: `${field.key}.${field.extension}`,
            content,
            language: languageForExtension(field.extension),
        })
    }

    return fields
}

export function hasDebugInformation(data: DebugInformation | null | undefined): boolean {
    if (!data) {
        return false
    }

    return DEBUG_FIELD_DEFINITIONS.some(({ key }) => data[key] != null)
}
