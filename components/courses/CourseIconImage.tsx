import { cn } from '@/lib/utils'

type CourseIconImageProps = {
    iconUrl: string
    className?: string
}

export function CourseIconImage({ iconUrl, className }: CourseIconImageProps) {
    console.log(iconUrl)
    return (
        <img
            src={iconUrl}
            alt=""
            className={cn('size-10 shrink-0 rounded-lg object-contain', className)}
            width={40}
            height={40}
        />
    )
}
