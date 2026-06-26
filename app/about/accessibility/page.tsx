import { AboutPageShell } from '@/components/about/AboutPageShell'
import { MarkdownDoc } from '@/components/documentation/MarkdownDoc'

export const metadata = { title: 'Accessibility — About — Jutge.org' }

export default function AboutAccessibilityPage() {
    return (
        <AboutPageShell
            activeTab="accessibility"
            breadcrumbs={[
                { title: 'About', url: '/about' },
                { title: 'Accessibility', url: '/about/accessibility' },
            ]}
        >
            <MarkdownDoc section="about" filename="accessibility.md" />
        </AboutPageShell>
    )
}
