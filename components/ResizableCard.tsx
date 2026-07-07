'use client'

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useCallback, useRef, useState, type ComponentProps, type PointerEvent as ReactPointerEvent } from 'react'

type ResizableCardProps = ComponentProps<typeof Card> & {
    defaultHeight?: number
    minHeight?: number
    maxHeight?: number
    onHeightChange?: (height: number) => void
}

function ResizableCard({
    className,
    style,
    defaultHeight = 240,
    minHeight = 120,
    maxHeight,
    onHeightChange,
    children,
    ...props
}: ResizableCardProps) {
    const [height, setHeight] = useState(defaultHeight)
    const dragState = useRef<{ startY: number; startHeight: number } | null>(null)

    const updateHeight = useCallback(
        (nextHeight: number) => {
            const clampedHeight = Math.max(
                minHeight,
                maxHeight !== undefined ? Math.min(maxHeight, nextHeight) : nextHeight,
            )
            setHeight(clampedHeight)
            onHeightChange?.(clampedHeight)
        },
        [maxHeight, minHeight, onHeightChange],
    )

    const handlePointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            event.preventDefault()
            dragState.current = { startY: event.clientY, startHeight: height }
            event.currentTarget.setPointerCapture(event.pointerId)
        },
        [height],
    )

    const handlePointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (!dragState.current) {
                return
            }

            const deltaY = event.clientY - dragState.current.startY
            updateHeight(dragState.current.startHeight + deltaY)
        },
        [updateHeight],
    )

    const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
        dragState.current = null
        event.currentTarget.releasePointerCapture(event.pointerId)
    }, [])

    return (
        <Card className={cn('relative min-h-0', className)} style={{ height, ...style }} {...props}>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
            <div
                role="separator"
                aria-orientation="horizontal"
                aria-label="Resize card height"
                aria-valuemin={minHeight}
                aria-valuemax={maxHeight}
                aria-valuenow={height}
                className={cn(
                    'absolute inset-x-0 bottom-0 z-10 flex h-3 touch-none items-end justify-center pb-0.5',
                    'cursor-ns-resize',
                )}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div aria-hidden className="h-1 w-9 rounded-full bg-border/80" />
            </div>
        </Card>
    )
}

export { CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ResizableCard }
