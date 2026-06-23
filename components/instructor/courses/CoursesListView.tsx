'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import { AgTableFull } from '@/components/administrator/AgTable'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useIsMobile } from '@/hooks/use-mobile'
import type { InstructorBriefCourse } from '@/lib/jutge_api_client'
import dayjs from 'dayjs'
import { SquarePlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CoursesListView() {
    const { client } = useJutgeAuth()

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
    const { client } = useJutgeAuth()

            const archived = await client.instructor.courses.getArchived()
            const dict = await client.instructor.courses.index()
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
            <div className="mb-4 flex flex-row gap-2">
                <Switch checked={showArchived} onCheckedChange={showArchivedChange} />
                <div className="text-sm">Archived courses</div>
                <div className="flex-grow" />
                <Link href="/instructor/courses/new">
                    <Button>
                        <SquarePlusIcon /> New course
                    </Button>
                </Link>
            </div>
            <AgTableFull rowData={rows} columnDefs={colDefs} />
        </>
    )
}
