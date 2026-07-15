'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Maximize2Icon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const MIN_SCALE = 0.25
const MAX_SCALE = 8
const ZOOM_STEP = 1.25

const SHADOW_STYLES = `
.viewport {
    display: inline-block;
    transform-origin: top left;
    background: #fff;
}
.viewport svg {
    display: block;
    max-width: none;
    max-height: none;
}
`

function normalizeSvgDimensions(svgElement: SVGSVGElement): { width: number; height: number } {
    const widthAttr = svgElement.getAttribute('width')
    const heightAttr = svgElement.getAttribute('height')
    const usesRelativeDimensions =
        widthAttr?.includes('%') ||
        heightAttr?.includes('%') ||
        widthAttr === '100%' ||
        heightAttr === '100%'

    let width = usesRelativeDimensions ? 0 : svgElement.width.baseVal.value
    let height = usesRelativeDimensions ? 0 : svgElement.height.baseVal.value
    const viewBox = svgElement.viewBox.baseVal

    if ((width <= 0 || height <= 0) && viewBox.width > 0 && viewBox.height > 0) {
        width = viewBox.width
        height = viewBox.height
        svgElement.setAttribute('width', String(width))
        svgElement.setAttribute('height', String(height))
    }

    if (width <= 0 || height <= 0) {
        try {
            const boundingBox = svgElement.getBBox()
            if (boundingBox.width > 0 && boundingBox.height > 0) {
                width = boundingBox.width
                height = boundingBox.height
                svgElement.setAttribute('width', String(width))
                svgElement.setAttribute('height', String(height))
            }
        } catch {
            // SVG may not be measurable yet.
        }
    }

    if (width <= 0 || height <= 0) {
        width = 800
        height = 600
        svgElement.setAttribute('width', String(width))
        svgElement.setAttribute('height', String(height))
    }

    svgElement.style.maxWidth = 'none'
    svgElement.style.maxHeight = 'none'

    return { width, height }
}

function fitSvgToContainer(
    svgElement: SVGSVGElement,
    container: HTMLElement,
    setScale: (scale: number) => void,
    setOffset: (offset: PanOffset) => void,
) {
    const { width, height } = normalizeSvgDimensions(svgElement)
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    if (containerWidth <= 0 || containerHeight <= 0) {
        return
    }

    const fitScale = Math.min(containerWidth / width, containerHeight / height, 1)

    setScale(fitScale)
    setOffset({
        x: (containerWidth - width * fitScale) / 2,
        y: (containerHeight - height * fitScale) / 2,
    })
}

type PanOffset = {
    x: number
    y: number
}

type CircuitModuleViewerProps = {
    moduleName: string
    svg: string
    variant?: 'embedded' | 'fullscreen'
    viewHref?: string
    showTitle?: boolean
    className?: string
    viewportClassName?: string
}

export function CircuitModuleViewer({
    moduleName,
    svg,
    variant = 'embedded',
    viewHref,
    showTitle = true,
    className,
    viewportClassName,
}: CircuitModuleViewerProps) {
    const hostRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const [offset, setOffset] = useState<PanOffset>({ x: 0, y: 0 })
    const panStateRef = useRef<{
        pointerId: number
        startX: number
        startY: number
        originX: number
        originY: number
    } | null>(null)
    const fitViewRef = useRef<(() => void) | null>(null)
    const isFullscreen = variant === 'fullscreen'

    useEffect(() => {
        const host = hostRef.current
        if (!host) {
            return
        }

        const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' })

        if (!shadow.querySelector('style[data-circuit-module]')) {
            const style = document.createElement('style')
            style.setAttribute('data-circuit-module', '')
            style.textContent = SHADOW_STYLES
            shadow.appendChild(style)
        }

        let viewport = shadow.querySelector<HTMLDivElement>('.viewport')
        if (!viewport) {
            viewport = document.createElement('div')
            viewport.className = 'viewport'
            shadow.appendChild(viewport)
        }

        viewport.innerHTML = svg

        requestAnimationFrame(() => {
            const svgElement = viewport.querySelector('svg')
            const container = host.parentElement
            if (!svgElement || !container) {
                return
            }

            fitViewRef.current = () => fitSvgToContainer(svgElement, container, setScale, setOffset)
            fitViewRef.current()
        })
    }, [svg])

    const resetView = useCallback(() => {
        if (fitViewRef.current) {
            fitViewRef.current()
            return
        }

        setScale(1)
        setOffset({ x: 0, y: 0 })
    }, [])

    const zoomIn = useCallback(() => {
        setScale((current) => Math.min(MAX_SCALE, current * ZOOM_STEP))
    }, [])

    const zoomOut = useCallback(() => {
        setScale((current) => Math.max(MIN_SCALE, current / ZOOM_STEP))
    }, [])

    const handlePointerDown = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (event.button !== 0) {
                return
            }

            panStateRef.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                originX: offset.x,
                originY: offset.y,
            }
            event.currentTarget.setPointerCapture(event.pointerId)
        },
        [offset.x, offset.y],
    )

    const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const panState = panStateRef.current
        if (!panState || panState.pointerId !== event.pointerId) {
            return
        }

        setOffset({
            x: panState.originX + (event.clientX - panState.startX),
            y: panState.originY + (event.clientY - panState.startY),
        })
    }, [])

    const handlePointerEnd = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const panState = panStateRef.current
        if (!panState || panState.pointerId !== event.pointerId) {
            return
        }

        panStateRef.current = null
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
    }, [])

    const toolbar = (
        <div className="inline-flex overflow-hidden rounded-lg border border-input">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Zoom in ${moduleName}`}
                        disabled={scale >= MAX_SCALE}
                        onClick={zoomIn}
                        className="rounded-none border-0 border-r border-input"
                    >
                        <ZoomInIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Zoom in</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Zoom out ${moduleName}`}
                        disabled={scale <= MIN_SCALE}
                        onClick={zoomOut}
                        className="rounded-none border-0 border-r border-input"
                    >
                        <ZoomOutIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Zoom out</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Reset zoom for ${moduleName}`}
                        onClick={resetView}
                        className={cn(
                            'rounded-none border-0',
                            viewHref && !isFullscreen ? 'border-r border-input' : undefined,
                        )}
                    >
                        <RotateCcwIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Reset zoom</TooltipContent>
            </Tooltip>
            {viewHref && !isFullscreen ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            asChild
                            variant="outline"
                            size="icon-sm"
                            aria-label={`Show ${moduleName} in full screen (opens in new window)`}
                            className="rounded-none border-0"
                        >
                            <Link href={viewHref} target="_blank" rel="noopener noreferrer">
                                <Maximize2Icon />
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Show in full screen</TooltipContent>
                </Tooltip>
            ) : null}
        </div>
    )

    return (
        <div
            className={cn(
                'flex flex-col items-center gap-2',
                isFullscreen ? 'h-full min-h-0 w-full' : 'w-64',
                className,
            )}
        >
            {!isFullscreen && showTitle ? (
                <p className="w-full truncate text-center text-sm font-medium text-foreground">{moduleName}</p>
            ) : null}
            <div
                className={cn(
                    'relative touch-none overflow-hidden rounded-lg border border-border bg-white cursor-grab active:cursor-grabbing',
                    isFullscreen ? 'min-h-0 w-full flex-1' : 'h-64 w-64',
                    viewportClassName,
                )}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
            >
                <div
                    ref={hostRef}
                    className="absolute inset-0 origin-top-left"
                    style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
                />
            </div>
            {toolbar}
        </div>
    )
}
