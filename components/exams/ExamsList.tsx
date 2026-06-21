import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ExamRow } from '@/lib/exams'

type ExamsListProps = {
    rows: ExamRow[]
}

export function ExamsList({ rows }: ExamsListProps) {
    return (
        <TooltipProvider>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                    {rows.length.toLocaleString()} {rows.length === 1 ? 'exam' : 'exams'}
                </p>

                <div className="rounded-xl border border-border bg-card shadow-xs">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="w-40">Place</TableHead>
                                <TableHead className="w-44">Start</TableHead>
                                <TableHead className="w-28">Duration</TableHead>
                                <TableHead className="w-24">Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No exams available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row) => (
                                    <TableRow key={row.exam_key}>
                                        <TableCell>
                                            {row.description ? (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="font-medium">{row.title}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-sm">
                                                        {row.description}
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : (
                                                <span className="font-medium">{row.title}</span>
                                            )}
                                            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                                {row.exam_key}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-sm">{row.place || '—'}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {row.exp_time_start}
                                        </TableCell>
                                        <TableCell className="text-sm">{row.running_time}</TableCell>
                                        <TableCell>
                                            <Badge variant={row.contest ? 'secondary' : 'outline'}>
                                                {row.contest ? 'Contest' : 'Exam'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </TooltipProvider>
    )
}
