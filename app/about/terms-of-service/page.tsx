import { AboutPageShell } from '@/components/about/AboutPageShell'
import { Prose } from '@/components/documentation/Prose'

export const metadata = { title: 'Terms of Service — About — Jutge.org' }

export default function AboutTermsOfServicePage() {
    return (
        <AboutPageShell
            activeTab="terms-of-service"
            breadcrumbs={[
                { title: 'About', url: '/about' },
                { title: 'Terms of Service', url: '/about/terms-of-service' },
            ]}
        >
            <Prose>
                <h2>Jutge.org&apos;s Terms of Service</h2>
                <p>
                    Jutge.org, as a research and education project pursues the science of learning. Online learners are
                    important participants in that pursuit. The information we gather from your engagement with our
                    instructional offerings makes it possible for all stakeholders engaged in the Jutge.org to
                    continuously improve their work and, in that process, build learning science. For purposes of
                    research, we may share information we collect from online learning activities with researchers
                    beyond Jutge.org project, after anonymization. Similarly, any research findings might be reported at
                    the aggregate level and will not expose your personal identity. Your personally identifiable
                    information will only be shared with the instructors and tutors of the courses you decide to enroll.
                    We use cookies to improve your experience. By registering you accept such use.
                </p>
            </Prose>
        </AboutPageShell>
    )
}
