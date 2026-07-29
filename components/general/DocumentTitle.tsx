'use client'

import { withSiteDocumentTitle } from '@/lib/documentTitle'
import { useEffect } from 'react'

type DocumentTitleProps = {
    title: string
}

/** Sets `document.title` to `{title} — Jutge.org` while mounted. */
export function DocumentTitle({ title }: DocumentTitleProps) {
    useEffect(() => {
        document.title = withSiteDocumentTitle(title)
    }, [title])

    return null
}
