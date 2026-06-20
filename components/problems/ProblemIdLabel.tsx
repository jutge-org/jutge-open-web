import { splitProblemId } from '@/lib/problems'
import { cn } from '@/lib/utils'

type ProblemIdLabelProps = {
    problemId: string
    className?: string
    suffixClassName?: string
}

export function ProblemIdLabel({ problemId, className, suffixClassName }: ProblemIdLabelProps) {
    const { main, suffix } = splitProblemId(problemId)

    return (
        <span className={className}>
            {main}
            {suffix ? <span className={cn('text-xs text-muted-foreground', suffixClassName)}> {suffix}</span> : null}
        </span>
    )
}
