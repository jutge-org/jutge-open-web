import type { Verdict } from '@/lib/jutge_api_client'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Link from 'next/link'

type VerdictsTableProps = {
    verdicts: Verdict[]
}

export function VerdictsTable({ verdicts }: VerdictsTableProps) {
    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
            <Table>
                <TableBody>
                    {verdicts.map((verdict) => (
                        <TableRow key={verdict.verdict_id}>
                            <TableCell className="w-28 font-medium">
                                <Link
                                    href={`/documentation/verdicts/${verdict.verdict_id}`}
                                    className="text-foreground underline-offset-4 hover:underline"
                                >
                                    {verdict.verdict_id}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center gap-4">
                                    <span aria-hidden>{verdict.emoji}</span>
                                    {verdict.name}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
