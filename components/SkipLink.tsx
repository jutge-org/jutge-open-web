import Link from 'next/link'

export function SkipLink() {
    return (
        <Link
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:ring-2 focus:ring-ring"
        >
            Skip to main content
        </Link>
    )
}
