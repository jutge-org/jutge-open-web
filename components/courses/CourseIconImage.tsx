import Image from 'next/image'

import { cn } from '@/lib/utils'

const sizeConfig = {
    '2xs': { width: 14, height: 14 },
    xs: { width: 16, height: 16 },
    '2sm': { width: 28, height: 28 },
    sm: { width: 48, height: 48 },
    md: { width: 64, height: 64 },
    lg: { width: 96, height: 96 },
} as const

type CourseIconImageProps = {
    iconUrl: string
    size?: keyof typeof sizeConfig
    className?: string
}

export function CourseIconImage({ iconUrl, size = 'sm', className }: CourseIconImageProps) {
    const { width, height } = sizeConfig[size]

    return (
        <Image
            src={iconUrl}
            alt=""
            className={cn('max-w-none shrink-0 rounded-sm object-contain', className)}
            width={width}
            height={height}
            style={{ width, height }}
            loading={size === 'lg' ? 'eager' : undefined}
        />
    )
}
