import { AboutPageShell } from '@/components/about/AboutPageShell'
import { Prose } from '@/components/documentation/Prose'

export const metadata = { title: 'Honor Code — About — Jutge.org' }

export default function AboutHonorCodePage() {
    return (
        <AboutPageShell
            activeTab="honor-code"
            breadcrumbs={[
                { title: 'About', url: '/about' },
                { title: 'Honor Code', url: '/about/honor-code' },
            ]}
        >
            <Prose>
                <h2>Jutge.org&apos;s Honor Code</h2>
                <p>
                    By registering in Jutge.org, you agree to: rely solely on your own work in connection with all
                    assessments, problems, homework and assignments (unless collaboration is expressly permitted);
                    acknowledge any and all external sources used in your work; refrain from any activity that would
                    dishonestly or fraudulently improve your results or disadvantage others in the course; refrain from
                    disclosing answers to assessments, problems, assignments and homework to others; maintain only one
                    user account and not let anyone else use your username and/or password; and not access or attempt to
                    access any other user&apos;s account, or misrepresent or attempt to misrepresent your identity while
                    using the site;be held responsible for your postings, submissions and publications inside this site;
                    be polite with others who can read the information you submitted to this site. This Honor Code is not
                    intended to prohibit discussion of course material. While users must submit work that is their own,
                    you should feel free to discuss lectures or other course material with others either in-person or
                    online.
                </p>
            </Prose>
        </AboutPageShell>
    )
}
