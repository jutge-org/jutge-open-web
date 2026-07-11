import { AboutCredits } from '@/components/about/AboutCredits'
import { AboutPageShell } from '@/components/about/AboutPageShell'

export default function AboutCreditsPage() {
    return (
        <AboutPageShell
            activeTab="credits"
            breadcrumbs={[
                { title: 'About', url: '/about' },
                { title: 'Credits', url: '/about/credits' },
            ]}
        >
            <AboutCredits />
        </AboutPageShell>
    )
}
