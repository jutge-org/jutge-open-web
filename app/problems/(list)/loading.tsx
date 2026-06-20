import { Spinner } from '@/components/ui/spinner'

export default function ProblemsLoading() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Spinner className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading problems…</p>
        </div>
    )
}
