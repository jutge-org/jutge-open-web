export const CIRCUITS_COMPILER_ID = 'Circuits'

export function circuitModuleViewHref(problemKey: string, submissionId: string, moduleName: string): string {
    return `/problems/${problemKey}/submissions/${submissionId}/circuits/${encodeURIComponent(moduleName)}`
}
