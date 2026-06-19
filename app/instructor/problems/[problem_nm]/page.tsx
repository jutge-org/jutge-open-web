import { redirect } from 'next/navigation'

type Props = {
    params: Promise<{ problem_nm: string }>
}

export default async function InstructorProblemRedirectPage({ params }: Props) {
    const { problem_nm } = await params
    redirect(`/instructor/problems/${problem_nm}/properties`)
}
