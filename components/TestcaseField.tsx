'use client'

import { useEffect, useState, type ReactNode } from 'react'

export function formatTestcaseText(text: string, showWhitespace: boolean): ReactNode {
    if (!showWhitespace) {
        return text
    }

    const parts: ReactNode[] = []

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index]

        if (char === ' ') {
            parts.push(
                <span key={index} className="text-muted-foreground">
                    ␣
                </span>,
            )
        } else if (char === '\n') {
            parts.push(
                <span key={index} className="text-muted-foreground">
                    ⏎
                </span>,
                '\n',
            )
        } else {
            parts.push(char)
        }
    }

    return parts
}

type TestcaseFieldProps = {
    label: string
    text?: string
    imageSrc?: string
    showWhitespace: boolean
    fontScale: number
}

export function TestcaseField({
    label,
    text,
    imageSrc,
    showWhitespace,
    fontScale,
}: TestcaseFieldProps) {
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)

    useEffect(() => {
        setImageSize(null)
    }, [imageSrc])

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <p className="ml-1 text-sm font-bold text-foreground">{label}</p>
            {imageSrc ? (
                <div className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageSrc}
                        alt={`${label} testcase`}
                        className="max-w-full origin-top-left"
                        style={{ width: `calc(100% * ${fontScale})` }}
                        onLoad={(event) => {
                            const img = event.currentTarget
                            setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
                        }}
                    />
                    {imageSize ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                            ({imageSize.width}×{imageSize.height})
                        </p>
                    ) : null}
                </div>
            ) : (
                <pre
                    className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm text-foreground"
                    style={{ fontSize: `calc(0.875rem * ${fontScale})` }}
                >
                    {formatTestcaseText(text ?? '', showWhitespace)}
                </pre>
            )}
        </div>
    )
}
