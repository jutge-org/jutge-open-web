export const CIRCUITS_COMPILER_ID = 'Circuits'

export type CircuitTraceValues = Record<string, string | string[] | number | boolean>

export type CircuitTrace = {
    input: CircuitTraceValues
    output: CircuitTraceValues
    expected: CircuitTraceValues
}

function isCircuitTrace(value: unknown): value is CircuitTrace {
    if (!value || typeof value !== 'object') {
        return false
    }

    const record = value as Record<string, unknown>
    return (
        record.input !== undefined &&
        typeof record.input === 'object' &&
        record.output !== undefined &&
        typeof record.output === 'object' &&
        record.expected !== undefined &&
        typeof record.expected === 'object'
    )
}

export function parseCircuitTracesJson(data: Record<string, unknown>): CircuitTrace[] {
    if (isCircuitTrace(data)) {
        return [data]
    }

    return sortCircuitRecordKeys(Object.keys(data))
        .map((key) => data[key])
        .filter((value): value is CircuitTrace => isCircuitTrace(value))
}

export function formatCircuitTraceValue(value: string | string[] | number | boolean): string {
    if (Array.isArray(value)) {
        return value.join(', ')
    }

    return String(value)
}

function sortCircuitRecordKeys(keys: string[]): string[] {
    return [...keys].sort((left, right) => {
        const leftNumber = Number(left)
        const rightNumber = Number(right)
        if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
            return leftNumber - rightNumber
        }

        return left.localeCompare(right, undefined, { numeric: true })
    })
}

export function parseCircuitTracesSvg(data: Record<string, string>): string[] {
    return sortCircuitRecordKeys(Object.keys(data)).map((key) => data[key]!)
}

export function circuitModuleViewHref(problemKey: string, submissionId: string, moduleName: string): string {
    return `/problems/${problemKey}/submissions/${submissionId}/circuits/${encodeURIComponent(moduleName)}`
}
