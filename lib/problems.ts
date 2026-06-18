export const PROBLEM_ID_RE = /^([A-Z]\d{5})_([a-z]{2})$/
export const PROBLEM_NM_RE = /^[A-Z]\d{5}$/

export type ParsedProblemKey =
    | { kind: 'problem_id'; problem_id: string; problem_nm: string; language_id: string }
    | { kind: 'problem_nm'; problem_nm: string }
    | { kind: 'invalid' }

export function parseProblemKey(key: string): ParsedProblemKey {
    const idMatch = key.match(PROBLEM_ID_RE)
    if (idMatch) {
        return {
            kind: 'problem_id',
            problem_id: key,
            problem_nm: idMatch[1],
            language_id: idMatch[2],
        }
    }

    if (PROBLEM_NM_RE.test(key)) {
        return { kind: 'problem_nm', problem_nm: key }
    }

    return { kind: 'invalid' }
}
