'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { useDynamic } from '@/hooks/use-dynamic'
import { showError } from '@/lib/instructor/utils'
import type { InstructorCourse } from '@/lib/jutge_api_client'
import dayjs from 'dayjs'
import { SaveIcon, TrashIcon } from 'lucide-react'
import { redirect, useParams } from 'next/navigation'
import { all } from 'radash'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export function CoursePropertiesView() {
    const { client } = useJutgeAuth()
    const { course_nm } = useParams<{ course_nm: string }>()
    const [course, setCourse] = useState<InstructorCourse | null>(null)
    const [archived, setArchived] = useState(false)

    const fetchData = useCallback(async () => {
        const data = await all({
            course: client.instructor.courses.get(course_nm),
            archived: client.instructor.courses.getArchived(),
        })
        setCourse(data.course)
        setArchived(data.archived.includes(course_nm))
    }, [course_nm])

    useEffect(() => {
        fetchData()
    }, [course_nm, fetchData])

    if (course === null) return <SimpleSpinner size={64} className="pt-24" />

    return <EditCourseForm fetchData={fetchData} course={course} archived={archived} setArchived={setArchived} />
}

type CourseFormProps = {
    course: InstructorCourse
    archived: boolean
    setArchived: (archived: boolean) => void
    fetchData: () => Promise<void>
}

function EditCourseForm(props: CourseFormProps) {
    const { client } = useJutgeAuth()

    const [runConfirmDialog, ConfirmDialogComponent] = useConfirmDialog({
        title: 'Delete course',
        acceptIcon: <TrashIcon />,
        acceptLabel: 'Yes, delete',
        cancelLabel: 'No',
    })

    const [course_nm] = useDynamic(props.course.course_nm, [props.course])
    const [title, setTitle] = useDynamic(props.course.title, [props.course])
    const [description, setDescription] = useDynamic(props.course.description, [props.course])
    const [annotation, setAnnotation] = useDynamic(props.course.annotation, [props.course])
    const [created_at] = useDynamic(dayjs(props.course.created_at).format('YYYY-MM-DD HH:mm:ss'), [props.course])
    const [updated_at] = useDynamic(dayjs(props.course.updated_at).format('YYYY-MM-DD HH:mm:ss'), [props.course])

    const fields: JFormFields = {
        title: {
            type: 'input',
            label: 'Title',
            value: title,
            setValue: setTitle,
            validator: z.string().min(5),
            placeHolder: 'Course Title',
        },
        created_at: {
            type: 'datetime',
            label: 'Created at',
            value: created_at,
            disabled: true,
        },
        updated_at: {
            type: 'datetime',
            label: 'Updated at',
            value: updated_at,
            disabled: true,
        },
        description: {
            type: 'markdown',
            label: 'Description',
            value: description,
            setValue: setDescription,
            placeHolder: 'Course description',
        },
        annotation: {
            type: 'input',
            label: 'Annotation',
            value: annotation,
            setValue: setAnnotation,
            validator: z.string(),
            placeHolder: 'Course annotation (instructor only)',
        },
        archived: {
            type: 'switch',
            label: 'Archived',
            value: props.archived,
            setValue: props.setArchived,
        },
        sep: { type: 'separator' },
        update: {
            type: 'button',
            text: 'Save',
            icon: <SaveIcon />,
            action: save,
        },
        delete: {
            type: 'button',
            text: 'Delete',
            icon: <TrashIcon />,
            action: remove,
            ignoreValidation: true,
        },
    }

    async function save() {
    const { client } = useJutgeAuth()

        const oldCurse = await client.instructor.courses.get(course_nm)
        const newCourse = {
            ...oldCurse,
            title,
            description,
            annotation,
        }

        try {
            await client.instructor.courses.update(newCourse)

            if (props.archived) await client.instructor.courses.archive(course_nm)
            else await client.instructor.courses.unarchive(course_nm)
        } catch (error) {
            return showError(error)
        }
        await props.fetchData()
        toast.success(`Course '${props.course.course_nm}' saved.`)
    }

    async function remove() {
    const { client } = useJutgeAuth()

        const message = `Are you sure you want to delete course '${props.course.course_nm}'?`
        if (!(await runConfirmDialog(message))) return

        try {
            await client.instructor.courses.remove(props.course.course_nm)
        } catch (error) {
            return showError(error)
        }
        toast.success(`Course '${props.course.course_nm}' deleted.`)
        redirect('/instructor/courses')
    }

    return (
        <>
            <JForm fields={fields} />
            <ConfirmDialogComponent />
        </>
    )
}
