import { Button } from '@/components/ui/button'
import { FileQuestionIcon, HomeIcon } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Page not found — Jutge.org' }

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <FileQuestionIcon className="size-8 text-muted-foreground" aria-hidden />
            <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">Page not found</h1>
                <p className="text-sm text-muted-foreground">
                    The page you requested does not exist or you may not have access to it.
                </p>
            </div>
            <nav aria-label="Helpful links" className="flex flex-wrap items-center justify-center gap-2">
                <Button asChild className="w-32">
                    <Link href="/">
                        <HomeIcon aria-hidden />
                        Home
                    </Link>
                </Button>
            </nav>
        </div>
    )
}
