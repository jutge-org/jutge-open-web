import { Gamepad2Icon, SquareArrowOutUpRightIcon } from 'lucide-react'

import { ExternalLink } from '@/components/ExternalLink'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function GameProblemCompetitionsCard() {
    return (
        <Card className="ring-0 border border-border shadow-sm">
            <CardContent className="flex items-center gap-5 pl-6">
                <span
                    className={cn(
                        'flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted/80',
                        'border-l-4 border-l-violet-500 text-violet-600 dark:text-violet-400',
                    )}
                    aria-hidden
                >
                    <Gamepad2Icon className="size-7 shrink-0" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">Competitions</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            This is a game problem. Submit players and dispute competitions on the dedicated games
                            platform.
                        </p>
                    </div>
                    <Button asChild className="w-fit gap-2">
                        <ExternalLink href="https://games.jutge.org">
                            <SquareArrowOutUpRightIcon aria-hidden />
                            games.jutge.org
                        </ExternalLink>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
