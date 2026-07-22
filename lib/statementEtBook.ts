export const STATEMENT_ET_BOOK_ON = 'on' as const
export const STATEMENT_ET_BOOK_OFF = 'off' as const

export const STATEMENT_ET_BOOK_OPTIONS = [STATEMENT_ET_BOOK_ON, STATEMENT_ET_BOOK_OFF] as const

export type StatementEtBookPreference = (typeof STATEMENT_ET_BOOK_OPTIONS)[number]

export const DEFAULT_STATEMENT_ET_BOOK: StatementEtBookPreference = STATEMENT_ET_BOOK_ON

export function parseStatementEtBook(value: string | null): StatementEtBookPreference | null {
    if ((STATEMENT_ET_BOOK_OPTIONS as readonly string[]).includes(value ?? '')) {
        return value as StatementEtBookPreference
    }

    return null
}

export function isStatementEtBookEnabled(preference: StatementEtBookPreference): boolean {
    return preference === STATEMENT_ET_BOOK_ON
}
