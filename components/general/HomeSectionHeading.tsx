type HomeSectionHeadingProps = {
    children: React.ReactNode
}

export function HomeSectionHeading({ children }: HomeSectionHeadingProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" aria-hidden />
            <div className="flex shrink-0 items-center gap-1">{children}</div>
            <div className="h-px flex-1 bg-border" aria-hidden />
        </div>
    )
}
