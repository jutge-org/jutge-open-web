import { ListPropertiesView } from '@/components/instructor/lists/ListPropertiesView'
import { InstructorPageShell } from '@/components/instructor/InstructorPageShell'
import { InstructorSubNav } from '@/components/instructor/InstructorSubNav'
import { instructorListSubNav } from '@/lib/instructor/menus'

export const metadata = { title: 'List properties — Instructor — Jutge.org' }

type Props = {
    params: Promise<{ list_nm: string }>
}

export default async function InstructorListPropertiesPage({ params }: Props) {
    const { list_nm } = await params
    const baseHref = `/instructor/lists/${list_nm}`

    return (
        <InstructorPageShell
            breadcrumbs={[
                { title: 'Instructor', url: '/instructor' },
                { title: 'Lists', url: '/instructor/lists' },
                { title: list_nm, url: `${baseHref}/properties` },
            ]}
        >
            <InstructorSubNav
                items={instructorListSubNav(list_nm)}
                baseHref={baseHref}
                activeSegment="properties"
            />
            <ListPropertiesView />
        </InstructorPageShell>
    )
}
