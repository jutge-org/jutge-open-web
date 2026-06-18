import { Prose } from '@/components/documentation/Prose'
import type { Verdict } from '@/lib/jutge_api_client'
import type { ReactNode } from 'react'

type VerdictDetailProps = {
    verdict: Verdict
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-foreground">{label}</dt>
            <dd className="text-sm text-muted-foreground">{children}</dd>
        </div>
    )
}

export function VerdictDetail({ verdict }: VerdictDetailProps) {
    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-foreground">
                    {verdict.verdict_id}: {verdict.name}
                </h2>
            </div>
            <Prose className="px-6 py-2">
                <dl>
                    <DetailRow label="">
                        <span className="text-3xl" aria-hidden>
                            {verdict.emoji}
                        </span>
                    </DetailRow>
                    <DetailRow label="Verdict">{verdict.name}</DetailRow>
                    <DetailRow label="Acronym">{verdict.verdict_id}</DetailRow>
                    <DetailRow label="Meaning">{verdict.description || '—'}</DetailRow>
                </dl>
            </Prose>
        </div>
    )
}
