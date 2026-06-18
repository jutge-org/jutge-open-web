import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
    size?: number
    className?: string
}

export default function SimpleSpinner(props: Props) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 500)
        return () => clearTimeout(timeout)
    }, [])

    if (!show) return null

    return (
        <div className={cn('flex flex-row justify-center gap-2', props.className)}>
            <LoaderIcon className="animate-spin" size={props.size || 18} />
        </div>
    )
}
