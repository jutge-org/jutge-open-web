import { AlertCircleIcon, SkullIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { hasProblemHealthIssues, isProblemDeprecated, isProblemUnchecked } from '@/lib/problems'
import type { Problem } from '@/lib/jutge_api_client'

type ProblemHealthCardProps = {
    problem: Problem
}

export function ProblemHealthCard({ problem }: ProblemHealthCardProps) {
    if (!hasProblemHealthIssues(problem)) {
        return null
    }

    const deprecated = isProblemDeprecated(problem)
    const unchecked = isProblemUnchecked(problem)

    return (
        <Card className="ring-0 border border-destructive/30 bg-destructive/5 shadow-sm">
            <CardHeader className="border-b border-destructive/20 pb-2">
                <CardTitle className="text-lg font-semibold text-destructive">Health warning</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
                <ul className="flex flex-col gap-3">
                    {deprecated ? (
                        <li className="flex gap-3 text-sm">
                            <SkullIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                            <div>
                                <p className="font-medium text-foreground">Deprecated</p>
                                <p className="text-muted-foreground">{problem.abstract_problem.deprecation}</p>
                            </div>
                        </li>
                    ) : null}
                    {unchecked ? (
                        <li className="flex gap-3 text-sm">
                            <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                            <div>
                                <p className="font-medium text-foreground">Checks failed</p>
                                <p className="text-muted-foreground">
                                    Internal checks for this language variant did not pass.
                                </p>
                            </div>
                        </li>
                    ) : null}
                </ul>
            </CardContent>
        </Card>
    )
}
