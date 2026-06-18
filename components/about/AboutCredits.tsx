import { Prose } from '@/components/documentation/Prose'
import type { ReactNode } from 'react'
import {
    developerCredits,
    maintenanceCredits,
    problemSetters,
    problemTranslators,
} from '@/lib/about'

function CreditSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="border-b border-border bg-muted/40 px-6 py-3 text-sm font-semibold text-foreground">{title}</h2>
            {children}
        </section>
    )
}

function MaintenancePerson({ name, image, affiliation }: { name: string; image: string; affiliation: string }) {
    return (
        <div className="flex gap-5 border-b border-border px-6 py-5 last:border-b-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="size-[120px] shrink-0 rounded-xl object-cover" />
            <div className="min-w-0">
                <h3 className="text-xl font-semibold text-foreground">{name}</h3>
                <address className="mt-1 text-sm not-italic leading-relaxed text-muted-foreground whitespace-pre-line">
                    {affiliation}
                </address>
            </div>
        </div>
    )
}

function DeveloperPerson({ name, image, role }: { name: string; image: string; role?: string }) {
    return (
        <div className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="size-20 shrink-0 rounded-full object-cover" />
            <p className="text-sm text-foreground">
                {name}
                {role ? ` (${role})` : ''}
            </p>
        </div>
    )
}

export function AboutCredits() {
    return (
        <div className="flex flex-col gap-6">
            <CreditSection title="Idea, development and maintenance">
                {maintenanceCredits.map((person) => (
                    <MaintenancePerson
                        key={person.name}
                        name={person.name}
                        image={person.image}
                        affiliation={person.affiliation ?? ''}
                    />
                ))}
            </CreditSection>

            <CreditSection title="Developers">
                {developerCredits.map((person) => (
                    <DeveloperPerson
                        key={`${person.name}-${person.role ?? 'dev'}`}
                        name={person.name}
                        image={person.image}
                        role={person.role}
                    />
                ))}
            </CreditSection>

            <CreditSection title="Problem setters">
                <ul className="divide-y divide-border">
                    {problemSetters.map((name) => (
                        <li key={name} className="px-6 py-3 text-sm text-muted-foreground">
                            {name}
                        </li>
                    ))}
                </ul>
            </CreditSection>

            <CreditSection title="Problem translators">
                <ul className="divide-y divide-border">
                    {problemTranslators.map((name) => (
                        <li key={name} className="px-6 py-3 text-sm text-muted-foreground">
                            {name}
                        </li>
                    ))}
                </ul>
            </CreditSection>
        </div>
    )
}
