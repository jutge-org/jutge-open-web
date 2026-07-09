import { Spinner } from '@/components/ui/spinner'

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
    // FIXME: This does not spin in Firefox!
    return (
        <div className="flex-1 flex flex-col gap-1 items-center justify-center">
            <Spinner className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{text}</p>
        </div>
    )
}
