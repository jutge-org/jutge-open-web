import { ListDuplicateView } from '@/components/instructor/lists/ListDuplicateView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorListSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'Duplicate list — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ list_nm: string }>
}

export default async function InstructorListDuplicatePage({ params }: Props) {
    const { list_nm } = await params
    const baseHref = `/instructor/lists/${list_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Lists', url: '/instructor/lists' },
                { title: list_nm, url: `${baseHref}/duplicate` },
            ]}
        >
            <InstructorSubNav
                items={instructorListSubNav(list_nm)}
                baseHref={baseHref}
                activeSegment="duplicate"
            />
            <ListDuplicateView />
        </InstructorPageShell>
    )
}
