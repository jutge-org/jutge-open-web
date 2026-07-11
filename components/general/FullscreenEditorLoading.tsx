import { WidgetSpinner } from '@/components/general/WidgetSpinner'
import { cn } from '@/lib/utils'

type FullscreenEditorLoadingProps = {
    title?: string
    className?: string
}

export function FullscreenEditorLoading({ title, className }: FullscreenEditorLoadingProps) {
    return (
        <div className={cn('fixed inset-0 flex flex-col bg-background', className)}>
            <header className="flex shrink-0 items-center border-b border-border px-4 py-2">
                <h1 className="truncate text-sm font-semibold text-foreground">{title ?? 'Loading…'}</h1>
            </header>
            <WidgetSpinner className="flex-1" label="Loading editor" />
        </div>
    )
}
