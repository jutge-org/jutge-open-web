'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

type ThemeToggleProps = {
    size?: 'icon' | 'icon-sm'
}

export function ThemeToggle({ size = 'icon' }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        queueMicrotask(() => setMounted(true))
    }, [])

    if (!mounted) {
        return (
            <span
                className={
                    size === 'icon-sm'
                        ? 'inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-transparent'
                        : 'inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-transparent'
                }
                aria-hidden
            />
        )
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <Button
            type="button"
            variant="outline"
            size={size}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
            {isDark ? <Sun className="size-[1.125rem]" /> : <Moon className="size-[1.125rem]" />}
        </Button>
    )
}
