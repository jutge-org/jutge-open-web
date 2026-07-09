import { cn } from '@/lib/utils'

type CourseIconImageProps = {
    iconUrl: string
    size?: 'sm' | 'lg'
    className?: string
}

const sizeConfig = {
    sm: { className: 'size-12', width: 48, height: 48 },
    lg: { className: 'size-24', width: 96, height: 96 },
} as const

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
