import { cn } from '@/lib/utils'

const sizeConfig = {
    sm: { className: 'size-12', width: 48, height: 48 },
    md: { className: 'size-16', width: 64, height: 64 },
    lg: { className: 'size-24', width: 96, height: 96 },
} as const

type CourseIconImageProps = {
    iconUrl: string
    size?: keyof typeof sizeConfig
    className?: string
}

export function CourseIconImage({ iconUrl, size = 'sm', className }: CourseIconImageProps) {
    const { className: sizeClassName, width, height } = sizeConfig[size]

    return (
        <img
            src={iconUrl}
            alt=""
            className={cn('shrink-0 rounded-sm object-contain', sizeClassName, className)}
            width={width}
            height={height}
        />
    )
}
