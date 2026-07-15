import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

type WidgetSpinnerProps = {
    className?: string
    label?: string
}

export function WidgetSpinner({ className, label = 'Loading' }: WidgetSpinnerProps) {
    return (
        <div aria-busy="true" aria-label={label} className={cn('flex items-center justify-center py-8', className)}>
            <Spinner className="size-8 text-muted-foreground" />
        </div>
    )
}
