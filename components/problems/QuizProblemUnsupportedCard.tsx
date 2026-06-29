import { SignatureIcon } from 'lucide-react'

import { ExternalLink } from '@/components/ExternalLink'
import { ProblemTypeIcon } from '@/components/problems/ProblemTypeIcon'
import { Card, CardContent } from '@/components/ui/card'
import { TooltipProvider } from '@/components/ui/tooltip'

type QuizProblemUnsupportedCardProps = {
    title: string
    problemNm: string
    author?: string | null
}

export function QuizProblemUnsupportedCard({ title, problemNm, author }: QuizProblemUnsupportedCardProps) {
    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardContent className="flex w-full flex-col gap-1">
                <TooltipProvider>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                        <p className="shrink-0 text-lg text-muted-foreground">
                            <ProblemTypeIcon type="quiz" className="mr-2 size-4 text-muted-foreground" />
                            {problemNm}
                        </p>
                    </div>
                </TooltipProvider>
                {author ? (
                    <p className="flex items-center gap-1 text-muted-foreground">
                        <SignatureIcon className="size-3 shrink-0" aria-hidden />
                        {author}
                    </p>
                ) : null}
                <p className="text-sm text-muted-foreground mt-4">
                    Sorry: Quiz problems are not supported yet. Quiz problems are available at{' '}
                    <ExternalLink href="https://jutge.org" className="text-foreground hover:underline">
                        jutge.org
                    </ExternalLink>
                    .
                </p>
            </CardContent>
        </Card>
    )
}
