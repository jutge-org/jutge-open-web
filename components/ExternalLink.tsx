import { type ComponentProps } from 'react'

export function OpensInNewWindow() {
    return <span className="sr-only"> (opens in new window)</span>
}

type ExternalLinkProps = ComponentProps<'a'> & {
    href: string
}

export function ExternalLink({ children, rel = 'noopener noreferrer', ...props }: ExternalLinkProps) {
    return (
        <a target="_blank" rel={rel} {...props}>
            {children}
            <OpensInNewWindow />
        </a>
    )
}
