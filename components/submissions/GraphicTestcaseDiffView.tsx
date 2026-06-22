'use client'

import { computeGraphicImageDiff, formatGraphicImageDifference } from '@/lib/graphicImageDiff'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

type GraphicTestcaseDiffViewProps = {
    outputImageSrc: string
    expectedImageSrc: string
    variant?: 'fullscreen' | 'embedded'
    fontScale?: number
    sideways?: boolean
}

function GraphicDiffPanel({
    imageSrc,
    loading,
    alt,
    variant,
    fontScale = 1,
}: {
    imageSrc?: string
    loading?: boolean
    alt: string
    variant: 'fullscreen' | 'embedded'
    fontScale?: number
}) {
    return (
        <div
            className={cn(
                'flex min-h-0 min-w-0 items-center justify-center overflow-auto rounded-lg border border-border p-4',
                variant === 'embedded' ? 'bg-muted/50' : 'bg-background',
            )}
        >
            {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={imageSrc}
                    alt={alt}
                    className="max-h-full max-w-full origin-top-left"
                    style={variant === 'embedded' ? { width: `calc(100% * ${fontScale})` } : undefined}
                />
            ) : loading ? (
                <p className="text-sm text-muted-foreground">Computing difference…</p>
            ) : null}
        </div>
    )
}

export function GraphicTestcaseDiffView({
    outputImageSrc,
    expectedImageSrc,
    variant = 'fullscreen',
    fontScale = 1,
    sideways = true,
}: GraphicTestcaseDiffViewProps) {
    const [diffImageSrc, setDiffImageSrc] = useState<string | null>(null)
    const [difference, setDifference] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        setLoading(true)
        setDiffImageSrc(null)
        setDifference(null)

        computeGraphicImageDiff(outputImageSrc, expectedImageSrc)
            .then((result) => {
                if (cancelled) {
                    return
                }

                setDiffImageSrc(result.diffImageSrc)
                setDifference(result.difference)
            })
            .catch(() => {
                if (!cancelled) {
                    setDiffImageSrc(null)
                    setDifference(null)
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [outputImageSrc, expectedImageSrc])

    const differenceLabel =
        difference !== null ? `Difference: ${formatGraphicImageDifference(difference)}` : 'Difference'

    if (variant === 'embedded') {
        return (
            <div className={cn('grid gap-4', sideways && 'md:grid-cols-3')}>
                <div className="flex min-w-0 flex-col gap-2">
                    <p className="ml-1 text-sm font-bold text-foreground">Output</p>
                    <GraphicDiffPanel
                        imageSrc={outputImageSrc}
                        alt="Output testcase"
                        variant={variant}
                        fontScale={fontScale}
                    />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                    <p className="ml-1 text-sm font-bold text-foreground">Expected</p>
                    <GraphicDiffPanel
                        imageSrc={expectedImageSrc}
                        alt="Expected testcase"
                        variant={variant}
                        fontScale={fontScale}
                    />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                    <p className="ml-1 text-sm font-bold text-foreground">{differenceLabel}</p>
                    <GraphicDiffPanel
                        imageSrc={diffImageSrc ?? undefined}
                        loading={loading}
                        alt="Difference testcase"
                        variant={variant}
                        fontScale={fontScale}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full min-h-0 flex-col px-4 pb-2">
            <div className="grid shrink-0 grid-cols-3 gap-4 py-2">
                <h2 className="text-sm font-semibold text-foreground">Output</h2>
                <h2 className="text-sm font-semibold text-foreground">Expected</h2>
                <h2 className="text-sm font-semibold text-foreground">{differenceLabel}</h2>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
                <GraphicDiffPanel imageSrc={outputImageSrc} alt="Output testcase" variant={variant} />
                <GraphicDiffPanel imageSrc={expectedImageSrc} alt="Expected testcase" variant={variant} />
                <GraphicDiffPanel
                    imageSrc={diffImageSrc ?? undefined}
                    loading={loading}
                    alt="Difference testcase"
                    variant={variant}
                />
            </div>
        </div>
    )
}
