'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function randomLetter(): string {
    // Use ASCII uppercase to keep rendering stable.
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return alphabet[Math.floor(Math.random() * alphabet.length)]
}

type AnimatedScrambleTextProps = {
    text: string
    className?: string
    durationMs?: number
}

export function AnimatedScrambleText({ text, className, durationMs = 1200 }: AnimatedScrambleTextProps) {
    const [displayText, setDisplayText] = useState(text)
    const rafRef = useRef<number | null>(null)
    const latestTextRef = useRef(text)

    useEffect(() => {
        latestTextRef.current = text
    }, [text])

    const run = useCallback(() => {
        if (prefersReducedMotion()) {
            setDisplayText(text)
            return
        }

        const target = latestTextRef.current
        const length = target.length

        if (length === 0) {
            setDisplayText('')
            return
        }

        // Start with a fully scrambled value so we don't briefly flash the final text.
        setDisplayText(Array.from({ length }, () => randomLetter()).join(''))

        const start = performance.now()

        const tick = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1)
            const revealCount = Math.floor(progress * length)

            let next = ''
            for (let i = 0; i < length; i++) {
                next += i < revealCount ? target[i] : randomLetter()
            }

            setDisplayText(next)

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick)
            } else {
                rafRef.current = null
            }
        }

        rafRef.current = requestAnimationFrame(tick)
    }, [durationMs, text])

    useEffect(() => {
        // Restart when the target text changes.
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
        setDisplayText(text)
        run()
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [text, run])

    return <span className={className}>{displayText}</span>
}
