'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function AccessDeniedGate() {
    const router = useRouter()

    useEffect(() => {
        toast.error('You do not have access to this page')
        router.push('/')
    }, [router])

    return null
}
