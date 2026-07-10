'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

const WELCOME_QUERY_PARAM = 'welcome'

type HomeWelcomeMessageProps = {
    userName: string
}

function HomeWelcomeMessageContent({ userName }: HomeWelcomeMessageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const hasWelcomeParam = searchParams.get(WELCOME_QUERY_PARAM) === '1'
    const [welcomed, setWelcomed] = useState(hasWelcomeParam)

    useEffect(() => {
        if (!hasWelcomeParam) {
            return
        }

        setWelcomed(true)
        router.replace('/', { scroll: false })
    }, [hasWelcomeParam, router])

    const isNewUser = welcomed || hasWelcomeParam

    return isNewUser ? `Welcome, ${userName}` : `Welcome back, ${userName}`
}

export function HomeWelcomeMessage({ userName }: HomeWelcomeMessageProps) {
    return (
        <Suspense fallback={`Welcome back, ${userName}`}>
            <HomeWelcomeMessageContent userName={userName} />
        </Suspense>
    )
}

export function buildHomeWelcomeUrl(): string {
    const params = new URLSearchParams({ [WELCOME_QUERY_PARAM]: '1' })
    return `/?${params.toString()}`
}
