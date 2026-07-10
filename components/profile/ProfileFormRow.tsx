import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type ProfileFormRowProps = {
    label: ReactNode
    htmlFor?: string
    children: ReactNode
    alignStart?: boolean
}

export function ProfileFormRow({ label, htmlFor, children, alignStart = false }: ProfileFormRowProps) {
    return (
        <div
            className={cn(
                'grid gap-2 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4',
                alignStart ? 'sm:items-start' : 'sm:items-center',
            )}
        >
            <dt className="sm:text-right">
                {htmlFor ? (
                    <Label htmlFor={htmlFor} className="sm:w-full sm:justify-end">
                        {label}
                    </Label>
                ) : (
                    <span className="text-sm font-medium">{label}</span>
                )}
            </dt>
            <dd className="min-w-0">{children}</dd>
        </div>
    )
}
