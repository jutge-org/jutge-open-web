import { publications } from '@/lib/about'

export function AboutPublications() {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <ul className="divide-y divide-border">
                {publications.map((publication, index) => (
                    <li
                        key={index}
                        className="px-6 py-4 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary [&_cite]:not-italic"
                        dangerouslySetInnerHTML={{ __html: publication.html }}
                    />
                ))}
            </ul>
        </div>
    )
}
