'use client'

import { fetchInstructorCoursesIndex, instructorExamCreate } from '@/actions/instructor'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { showError } from '@/lib/instructor/utils'
import type { InstructorBriefCourse } from '@/lib/jutge_api_client'
import { CirclePlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export function ExamsNewView() {
    const [exam_nm, setExam_nm] = useState('')
    const [course_nm, setCourse_nm] = useState<string | null>('')
    const [title, setTitle] = useState('')
    const [expectedStart, setExpectedStart] = useState(new Date().toISOString())

    const [courses, setCourses] = useState<Record<string, InstructorBriefCourse>>({})

    useEffect(() => {
        async function fetchCourses() {
            const courses = await fetchInstructorCoursesIndex()
            setCourses(courses)
        }
        fetchCourses()
    }, [])

    const fields: JFormFields = {
        exam_nm: {
            type: 'input',
            label: 'Id',
            value: exam_nm,
            setValue: setExam_nm,
            validator: z
                .string()
                .min(8)
                .regex(/^[a-zA-Z0-9_-]*$/, 'Only alphanumeric characters are allowed'),
            placeHolder: 'Id of the exam',
        },
        title: {
            type: 'input',
            label: 'Title',
            value: title,
            setValue: setTitle,
            validator: z.string().min(8),
            placeHolder: 'Title of the exam',
        },
        course: {
            type: 'select',
            label: 'Course',
            value: course_nm,
            setValue: setCourse_nm,
            options: [{ value: '', label: '—' }].concat(
                Object.entries(courses)
                    .map(([course_nm, course]) => ({
                        value: course_nm,
                        label: course.title,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label)),
            ),
        },
        expectedStart: {
            type: 'datetime',
            label: 'Expected start time',
            value: expectedStart,
            setValue: setExpectedStart,
            placeHolder: 'When the exam is expected to start',
        },
        foo: {
            type: 'free',
            label: '',
            content: <div className="text-sm mt-4">More properties will be available after creating the exam.</div>,
        },
        sep: { type: 'separator' },
        update: {
            type: 'button',
            text: 'Add exam',
            icon: <CirclePlusIcon />,
            action: addAction,
        },
    }

    async function addAction() {
        try {
            await instructorExamCreate({
                exam_nm,
                course_nm: course_nm || '',
                title,
                exp_time_start: expectedStart,
            })
        } catch (error) {
            return showError(error)
        }
        toast.success(`Exam '${exam_nm}' created.`)
        redirect(`/instructor/exams/${exam_nm}/properties`)
    }

    return <JForm fields={fields} />
}
