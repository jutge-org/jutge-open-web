/** Jutge.org verdict palette (aligned with the classic dashboard). */
export const VERDICT_COLORS: Record<string, string> = {
    AC: '#5cb85c',
    WA: '#d9534f',
    CE: '#EEC900',
    EE: '#808080',
    FE: '#000000',
    IC: '#FFD700',
    PE: '#F5D547',
    SC: '#f0ad4e',
    IE: '#d9534f',
    SE: '#d9534f',
    NC: '#d9534f',
    OK: '#5cb85c',
    KO: '#d9534f',
    NT: '#808080',
}

const COMPILER_COLOR_OVERRIDES: Record<string, string> = {
    PRO2: '#B85C6E',
    MakePRO2: '#A64D5E',
    Make: '#B85C6E',
}

export function verdictColor(key: string, hexColors?: Record<string, string>): string {
    return hexColors?.[key] ?? VERDICT_COLORS[key] ?? '#94a3b8'
}

export function compilerColor(key: string, hexColors?: Record<string, string>): string {
    return COMPILER_COLOR_OVERRIDES[key] ?? hexColors?.[key] ?? '#337ab7'
}

export function proglangColor(key: string, index: number): string {
    const palette = ['#337ab7', '#5cb85c', '#f0ad4e', '#d9534f', '#9b59b6', '#1abc9c', '#e67e22']
    return palette[index % palette.length]!
}
