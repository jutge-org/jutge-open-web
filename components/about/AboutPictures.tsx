import { ExternalLink } from '@/components/ExternalLink'
import { pictureItems } from '@/lib/about'
import { Prose } from '@/components/documentation/Prose'

export function AboutPictures() {
    return (
        <div className="flex flex-col gap-6">
            <Prose>
                <h2>Pictures</h2>
            </Prose>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {pictureItems.map((picture) => (
                    <figure
                        key={picture.src}
                        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                    >
                        <ExternalLink href={picture.src} className="block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={picture.src} alt={picture.alt} className="aspect-[4/3] w-full object-cover" />
                        </ExternalLink>
                        <figcaption className="space-y-1 px-4 py-3">
                            <h3 className="text-sm font-semibold text-foreground">{picture.title}</h3>
                            <p className="text-sm text-muted-foreground">{picture.description}</p>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    )
}
