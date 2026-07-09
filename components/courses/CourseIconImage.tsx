import { cn } from '@/lib/utils'

type CourseIconImageProps = {
    iconUrl: string
    size?: 'sm' | 'lg'
    className?: string
}

const sizeConfig = {
    sm: { className: 'size-10', width: 40, height: 40 },
    lg: { className: 'size-20', width: 80, height: 80 },
} as const

export function CourseIconImage({ iconUrl, size = 'sm', className }: CourseIconImageProps) {
    const { className: sizeClassName, width, height } = sizeConfig[size]

    return (
        <img
            src={iconUrl}
            alt=""
            className={cn('shrink-0 rounded-lg object-contain', sizeClassName, className)}
            width={width}
            height={height}
        />
    )
}
