'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Prose } from '@/components/documentation/Prose'
import { cn } from '@/lib/utils'

type MarkdownTextProps = {
    children: string
    className?: string
}

export function MarkdownText({ children, className }: MarkdownTextProps) {
    return (
        <Prose
            className={cn(
                'prose-sm text-sm leading-relaxed text-muted-foreground prose-p:my-0 [&_p:not(:last-child)]:mb-2 prose-headings:my-0 prose-headings:text-foreground prose-ul:my-0 prose-ol:my-0',
                className,
            )}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </Prose>
    )
}
