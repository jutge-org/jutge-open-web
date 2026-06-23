'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type AnimatedStatValueProps = {
    value: number
    className?: string
    durationMs?: number
    replayKey?: number
}

function easeOutCubic(t: number): number {
    return 1 - (1 - t) ** 3
}

function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function AnimatedStatValue({ value, className, durationMs = 1500, replayKey = 0 }: AnimatedStatValueProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const [displayValue, setDisplayValue] = useState(0)
    const hasEnteredViewRef = useRef(false)
    const animationFrameRef = useRef<number>(undefined)

    const runAnimation = useCallback(
        (target: number) => {
            if (animationFrameRef.current !== undefined) {
                cancelAnimationFrame(animationFrameRef.current)
            }

            if (prefersReducedMotion()) {
                setDisplayValue(target)
                return
            }

            setDisplayValue(0)
            const start = performance.now()

            const animate = (now: number) => {
                const progress = Math.min((now - start) / durationMs, 1)
                setDisplayValue(Math.round(easeOutCubic(progress) * target))
                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(animate)
                } else {
                    animationFrameRef.current = undefined
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate)
        },
        [durationMs],
    )

    useEffect(() => {
        const el = ref.current
        if (!el) return

        if (prefersReducedMotion()) {
            setDisplayValue(value)
            hasEnteredViewRef.current = true
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (!entry?.isIntersecting || hasEnteredViewRef.current) return

                hasEnteredViewRef.current = true
                observer.disconnect()
                runAnimation(value)
            },
            { threshold: 0.2 },
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [value, runAnimation])

    useEffect(() => {
        if (!hasEnteredViewRef.current || replayKey === 0) return
        runAnimation(value)
    }, [replayKey, value, runAnimation])

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== undefined) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    return (
        <span ref={ref} className={cn(className)}>
            {displayValue.toLocaleString()}
        </span>
    )
}
