export type CompilationErrorField = 'compilation1' | 'compilation2' | 'linkage' | 'interface'

const GCC_COLORIZED_COMPILER_IDS = new Set([
    'GCC',
    'G++',
    'G++11',
    'G++17',
    'PRO2',
    'GPC',
    'GCJ',
    'P1++',
    'GDC',
    'GObjC',
    'GNAT',
    'MyPy',
])

const GCC_STYLES = {
    intro: 'font-bold text-foreground',
    warningWhere: 'font-normal text-orange-500',
    warningMessage: 'text-blue-600 dark:text-blue-400',
    errorWhere: 'font-normal text-red-600 dark:text-red-400',
    errorMessage: 'text-blue-600 dark:text-blue-400',
    pointer: 'text-emerald-600 dark:text-emerald-400',
    quoted: 'text-violet-600 dark:text-violet-400',
} as const

const GCC_POINTER_LINE = /^\s+\^~+$/
const GCC_PIPE_POINTER_LINE = /^(\s+\|\s+)(\^~+)$/
const GCC_QUOTED_STRING = /("[^"]*"|'[^']*'|\u2018[^\u2019]*\u2019)/g
const GCC_IN_CONTEXT_LINE = /^In .+:$/

function colorizeGccPointerLine(line: string): string | null {
    const pipePointer = line.match(GCC_PIPE_POINTER_LINE)
    if (pipePointer) {
        const [, prefix, pointer] = pipePointer
        return escapeHtml(prefix) + wrapSpan(GCC_STYLES.pointer, escapeHtml(pointer))
    }

    if (GCC_POINTER_LINE.test(line)) {
        return wrapSpan(GCC_STYLES.pointer, escapeHtml(line))
    }

    return null
}

const ANSI_CLASSES: Record<string, string> = {
    '1': 'font-bold',
    '30': 'text-foreground',
    '31': 'text-red-600 dark:text-red-400',
    '32': 'text-green-600 dark:text-green-400',
    '33': 'text-yellow-600 dark:text-yellow-400',
    '34': 'text-blue-600 dark:text-blue-400',
    '35': 'text-fuchsia-600 dark:text-fuchsia-400',
    '36': 'text-cyan-600 dark:text-cyan-400',
    '37': 'text-foreground',
    '90': 'text-muted-foreground',
    '91': 'text-red-500 dark:text-red-300',
    '92': 'text-green-500 dark:text-green-300',
    '93': 'text-yellow-500 dark:text-yellow-300',
    '94': 'text-blue-500 dark:text-blue-300',
    '95': 'text-fuchsia-500 dark:text-fuchsia-300',
    '96': 'text-cyan-500 dark:text-cyan-300',
    '97': 'text-foreground',
}

function escapeHtml(text: string): string {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function wrapSpan(className: string, content: string): string {
    return `<span class="${className}">${content}</span>`
}

function colorizeQuotedStrings(text: string): string {
    let result = ''
    let lastIndex = 0

    for (const match of text.matchAll(GCC_QUOTED_STRING)) {
        const index = match.index ?? 0
        result += escapeHtml(text.slice(lastIndex, index))

        const quoted = match[0]
        const openQuote = quoted[0]
        const closeQuote = quoted[quoted.length - 1]
        const content = quoted.slice(1, -1)

        result +=
            escapeHtml(openQuote) + wrapSpan(GCC_STYLES.quoted, escapeHtml(content)) + escapeHtml(closeQuote)
        lastIndex = index + quoted.length
    }

    result += escapeHtml(text.slice(lastIndex))
    return result
}

function colorizeGccIntroLine(line: string): string {
    return wrapSpan(GCC_STYLES.intro, colorizeQuotedStrings(line))
}

function colorizeGccCompilationLine(line: string): string {
    const filenameLineMessage = line.match(/^(.*?):([0-9]+):(.*)$/)
    if (filenameLineMessage) {
        const [, filename, lineNumber, message] = filenameLineMessage
        const location = `${escapeHtml(filename)}:${escapeHtml(lineNumber)}:`

        if (/\s+warning:.*/.test(message)) {
            return (
                wrapSpan(GCC_STYLES.warningWhere, location) +
                wrapSpan(GCC_STYLES.warningMessage, escapeHtml(message))
            )
        }

        return wrapSpan(GCC_STYLES.errorWhere, location) + wrapSpan(GCC_STYLES.errorMessage, escapeHtml(message))
    }

    const intro = line.match(/^(.*?):(.+):$/)
    if (intro) {
        return colorizeGccIntroLine(line)
    }

    if (GCC_IN_CONTEXT_LINE.test(line)) {
        return colorizeGccIntroLine(line)
    }

    const pointerLine = colorizeGccPointerLine(line)
    if (pointerLine !== null) {
        return pointerLine
    }

    return escapeHtml(line)
}

export function colorizeGccCompilationOutput(text: string): string {
    return text.split(/\r?\n/).map(colorizeGccCompilationLine).join('\n')
}

function applyAnsiCodes(codes: string, activeClasses: string[]): string[] {
    const next = [...activeClasses]

    for (const code of codes.length > 0 ? codes.split(';').filter((value) => value.length > 0) : ['0']) {
        if (code === '0') {
            next.length = 0
            continue
        }

        const className = ANSI_CLASSES[code]
        if (className && !next.includes(className)) {
            next.push(className)
        }
    }

    return next
}

export function colorizeAnsiOutput(text: string): string {
    const parts = text.split(/\x1b\[([0-9;]*)m/)
    let activeClasses: string[] = []
    let html = ''

    for (let index = 0; index < parts.length; index += 1) {
        if (index % 2 === 1) {
            activeClasses = applyAnsiCodes(parts[index], activeClasses)
            continue
        }

        const chunk = parts[index]
        if (!chunk) {
            continue
        }

        const escaped = escapeHtml(chunk)
        if (activeClasses.length > 0) {
            html += wrapSpan(activeClasses.join(' '), escaped)
        } else {
            html += escaped
        }
    }

    return html
}

export type CompilationErrorColorization = 'gcc' | 'ansi' | null

export function compilationErrorColorization(compilerId: string): CompilationErrorColorization {
    if (compilerId === 'Codon') {
        return 'ansi'
    }

    if (GCC_COLORIZED_COMPILER_IDS.has(compilerId)) {
        return 'gcc'
    }

    return null
}

export function shouldColorizeCompilationField(
    compilerId: string,
    field: CompilationErrorField,
): CompilationErrorColorization {
    if (field === 'interface') {
        return null
    }

    return compilationErrorColorization(compilerId)
}

export type CompilationErrorContent =
    | { type: 'html'; html: string }
    | { type: 'plain'; text: string }

export function formatCompilationErrorContent(
    text: string,
    compilerId: string,
    field: CompilationErrorField,
): CompilationErrorContent {
    const colorization = shouldColorizeCompilationField(compilerId, field)

    if (colorization === 'gcc') {
        return { type: 'html', html: colorizeGccCompilationOutput(text) }
    }

    if (colorization === 'ansi') {
        return { type: 'html', html: colorizeAnsiOutput(text) }
    }

    return { type: 'plain', text }
}
