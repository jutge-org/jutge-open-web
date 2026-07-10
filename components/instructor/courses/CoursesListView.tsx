'use client'

import { fetchInstructorCoursesArchived, fetchInstructorCoursesIndex } from '@/actions/instructor'
import { AgTableFull } from '@/components/administrator/AgTable'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useIsMobile } from '@/hooks/use-mobile'
import type { InstructorBriefCourse } from '@/lib/jutge_api_client'
import dayjs from 'dayjs'
import { SquarePlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CoursesListView() {
    const isMobile = useIsMobile()

    const [courses, setCourses] = useState<InstructorBriefCourse[]>([])
    const [rows, setRows] = useState<InstructorBriefCourse[]>([])
    const [archived, setArchived] = useState<string[]>([])
    const [showArchived, setShowArchived] = useState(false)

    const [colDefs, setColDefs] = useState([
        {
            field: 'course_nm',
            headerName: 'Id',
            cellRenderer: (p: { data: InstructorBriefCourse }) => (
                <Link href={`/instructor/courses/${p.data.course_nm}/properties`}>{p.data.course_nm}</Link>
            ),
            flex: 1,
            filter: true,
        },
        { field: 'title', flex: 2, filter: true },
        {
            field: 'created_at',
            headerName: 'Created',
            width: 140,
            filter: true,
            valueGetter: (p: { data: InstructorBriefCourse }) => dayjs(p.data.created_at).format('YYYY-MM-DD'),
        },
        {
            field: 'updated_at',
            headerName: 'Updated',
            width: 140,
            filter: true,
            valueGetter: (p: { data: InstructorBriefCourse }) => dayjs(p.data.updated_at).format('YYYY-MM-DD'),
            sort: 'desc',
        },
    ])

    useEffect(() => {
        if (isMobile) setColDefs((colDefs) => colDefs.filter((c) => c.field !== 'annotation'))
    }, [isMobile])

    useEffect(() => {
        async function fetchCourses() {
            const archived = await fetchInstructorCoursesArchived()
            const dict = await fetchInstructorCoursesIndex()
            const array = Object.values(dict).sort((a, b) => a.course_nm.localeCompare(b.course_nm))
            setRows(array.filter((course) => !archived.includes(course.course_nm)))
            setCourses(array)
            setArchived(archived)
        }

        fetchCourses()
    }, [])

    function showArchivedChange(checked: boolean) {
        setShowArchived(checked)
        if (checked) {
            setRows(courses.filter((course) => archived.includes(course.course_nm)))
        } else {
            setRows(courses.filter((course) => !archived.includes(course.course_nm)))
        }
    }

    return (
        <>
            <div className="flex flex-row gap-2 items-center">
                <Link href="/instructor/courses/new">
                    <Button variant="outline">
                        <SquarePlusIcon /> New course
                    </Button>
                </Link>
                <div className="grow" />
                <Label>
                    <Switch checked={showArchived} onCheckedChange={showArchivedChange} />
                    <div className="text-sm">Show archived courses</div>
                </Label>
            </div>
            <AgTableFull rowData={rows} columnDefs={colDefs} />
        </>
    )
}
