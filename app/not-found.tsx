import { Button } from '@/components/ui/button'
import { BookTextIcon, FileQuestionIcon, HomeIcon, ListIcon } from 'lucide-react'
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
                <Button asChild>
                    <Link href="/">
                        <HomeIcon aria-hidden />
                        Home
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/problems/public">
                        <ListIcon aria-hidden />
                        Public problems
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/documentation">
                        <BookTextIcon aria-hidden />
                        Documentation
                    </Link>
                </Button>
            </nav>
        </div>
    )
}
