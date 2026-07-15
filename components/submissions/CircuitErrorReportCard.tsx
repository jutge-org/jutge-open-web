import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCircuitTraceValue, type CircuitTrace, type CircuitTraceValues } from '@/lib/circuits'

type CircuitErrorReportCardProps = {
    index: number
    trace: CircuitTrace
}

function CircuitTraceValuesTable({ values }: { values: CircuitTraceValues }) {
    const entries = Object.entries(values)

    if (entries.length === 0) {
        return <p className="text-sm text-muted-foreground">—</p>
    }

    return (
        <Table>
            <TableBody>
                {entries.map(([key, value]) => (
                    <TableRow key={key} className="hover:bg-transparent">
                        <TableCell className="px-2 py-1 align-top font-medium text-foreground">{key}</TableCell>
                        <TableCell className="px-2 py-1 align-top text-muted-foreground">
                            {formatCircuitTraceValue(value)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export function CircuitErrorReportCard({ index, trace }: CircuitErrorReportCardProps) {
    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold">Error report {index}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-4">Input</TableHead>
                            <TableHead className="px-4">Expected</TableHead>
                            <TableHead className="px-4">Output</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="px-4 align-top">
                                <CircuitTraceValuesTable values={trace.input} />
                            </TableCell>
                            <TableCell className="px-4 align-top">
                                <CircuitTraceValuesTable values={trace.expected} />
                            </TableCell>
                            <TableCell className="px-4 align-top">
                                <CircuitTraceValuesTable values={trace.output} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
