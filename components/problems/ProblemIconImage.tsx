import Image from 'next/image'

import { cn } from '@/lib/utils'

const sizeConfig = {
    xs: { className: 'size-4', width: 16, height: 16 },
    sm: { className: 'size-5', width: 20, height: 20 },
    md: { className: 'size-8', width: 32, height: 32 },
    lg: { className: 'size-28', width: 112, height: 112 },
} as const

type ProblemIconImageProps = {
    iconUrl: string
    size?: keyof typeof sizeConfig
    className?: string
}

export function ProblemIconImage({ iconUrl, size = 'sm', className }: ProblemIconImageProps) {
    const { className: sizeClassName, width, height } = sizeConfig[size]

    return (
        <Image
            src={iconUrl}
            alt=""
            className={cn('block shrink-0 rounded-sm object-contain', sizeClassName, className)}
            width={width}
            height={height}
            loading={size === 'lg' ? 'eager' : undefined}
        />
    )
}
