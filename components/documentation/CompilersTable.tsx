import { compilerIdToSlug, getCompilerStatus } from '@/lib/documentation'
import type { Compiler } from '@/lib/jutge_api_client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type CompilersTableProps = {
    compilers: Compiler[]
}

export function CompilersTable({ compilers }: CompilersTableProps) {
    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Compiler</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {compilers.map((compiler) => {
                        const status = getCompilerStatus(compiler)
                        return (
                            <TableRow key={compiler.compiler_id}>
                                <TableCell className={cn(status.defunct && 'line-through')}>
                                    <Link
                                        href={`/documentation/compilers/${compilerIdToSlug(compiler.compiler_id)}`}
                                        title={compiler.version ?? undefined}
                                        className="font-medium text-foreground underline-offset-4 hover:underline"
                                    >
                                        {compiler.compiler_id}
                                    </Link>
                                </TableCell>
                                <TableCell className={cn(status.defunct && 'line-through')}>{compiler.name}</TableCell>
                                <TableCell>{compiler.language}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center gap-1.5">
                                        <span aria-hidden>{status.icon}</span>
                                        {status.label}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
