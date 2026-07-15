export type TraditionalDiffLine =
    | { kind: 'hunk-header'; text: string }
    | { kind: 'file-header'; text: string }
    | { kind: 'separator' }
    | { kind: 'remove'; text: string; prefix: string }
    | { kind: 'add'; text: string; prefix: string }
    | { kind: 'context'; text: string; prefix: string }
    | { kind: 'plain'; text: string }

const CLASSIC_HUNK_HEADER = /^\d+(?:,\d+)?[acd]\d+(?:,\d+)?$/
const UNIFIED_HUNK_HEADER = /^@@ -\d+(?:,\d+)? \+\d+(?:,\d+)? @@/

function normalizeNewlines(text: string): string {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function parseClassicDiff(lines: string[]): TraditionalDiffLine[] {
    const result: TraditionalDiffLine[] = []

    for (const line of lines) {
        if (CLASSIC_HUNK_HEADER.test(line)) {
            result.push({ kind: 'hunk-header', text: line })
            continue
        }

        if (line === '---') {
            result.push({ kind: 'separator' })
            continue
        }

        if (line.startsWith('< ')) {
            result.push({ kind: 'remove', text: line.slice(2), prefix: '< ' })
            continue
        }

        if (line.startsWith('> ')) {
            result.push({ kind: 'add', text: line.slice(2), prefix: '> ' })
            continue
        }

        if (line === '<' || line === '>') {
            continue
        }

        result.push({ kind: 'plain', text: line })
    }

    return result
}

function parseUnifiedDiff(lines: string[]): TraditionalDiffLine[] {
    const result: TraditionalDiffLine[] = []

    for (const line of lines) {
        if (line.startsWith('--- ') || line.startsWith('+++ ')) {
            result.push({ kind: 'file-header', text: line })
            continue
        }

        if (UNIFIED_HUNK_HEADER.test(line)) {
            result.push({ kind: 'hunk-header', text: line })
            continue
        }

        if (line.startsWith('-')) {
            result.push({ kind: 'remove', text: line.slice(1), prefix: '-' })
            continue
        }

        if (line.startsWith('+')) {
            result.push({ kind: 'add', text: line.slice(1), prefix: '+' })
            continue
        }

        if (line.startsWith(' ')) {
            result.push({ kind: 'context', text: line.slice(1), prefix: ' ' })
            continue
        }

        result.push({ kind: 'plain', text: line })
    }

    return result
}

function isUnifiedDiff(text: string, lines: string[]): boolean {
    return (
        (/^--- /m.test(text) && /^\+\+\+ /m.test(text)) || lines.some((line) => UNIFIED_HUNK_HEADER.test(line))
    )
}

function isClassicDiff(lines: string[]): boolean {
    return lines.some((line) => CLASSIC_HUNK_HEADER.test(line))
}

export function parseTraditionalDiff(text: string): TraditionalDiffLine[] {
    const normalized = normalizeNewlines(text).trimEnd()
    if (!normalized) {
        return []
    }

    const lines = normalized.split('\n')

    if (isUnifiedDiff(normalized, lines)) {
        return parseUnifiedDiff(lines)
    }

    if (isClassicDiff(lines)) {
        return parseClassicDiff(lines)
    }

    return lines.map((line) => ({ kind: 'plain', text: line }))
}
