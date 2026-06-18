import { AboutPageShell } from '@/components/about/AboutPageShell'
import { AboutPictures } from '@/components/about/AboutPictures'

export const metadata = { title: 'Pictures — About — Jutge.org' }

export default function AboutPicturesPage() {
    return (
        <AboutPageShell
            activeTab="pictures"
            breadcrumbs={[
                { title: 'About', url: '/about' },
                { title: 'Pictures', url: '/about/pictures' },
            ]}
        >
            <AboutPictures />
        </AboutPageShell>
    )
}
