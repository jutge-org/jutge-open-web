import { AboutPageShell } from '@/components/about/AboutPageShell'
import { AboutPublications } from '@/components/about/AboutPublications'

export const metadata = { title: 'Publications — About — Jutge.org' }

export default function AboutPublicationsPage() {
    return (
        <AboutPageShell
            activeTab="publications"
            breadcrumbs={[
                { title: 'About', url: '/about' },
                { title: 'Publications', url: '/about/publications' },
            ]}
        >
            <AboutPublications />
        </AboutPageShell>
    )
}
