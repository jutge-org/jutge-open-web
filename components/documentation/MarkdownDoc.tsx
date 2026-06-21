import { Prose } from '@/components/documentation/Prose'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownDocProps = {
    filename: string
}

export async function MarkdownDoc({ filename }: MarkdownDocProps) {
    const filePath = path.join(process.cwd(), 'content', 'documentation', filename)
    const content = await readFile(filePath, 'utf8')

    return (
        <Prose>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children }) => {
                        if (href?.startsWith('/')) {
                            return (
                                <Link
                                    href={href}
                                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                                >
                                    {children}
                                </Link>
                            )
                        }
                        return (
                            <a href={href} target="_blank" rel="noreferrer">
                                {children}
                            </a>
                        )
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </Prose>
    )
}
