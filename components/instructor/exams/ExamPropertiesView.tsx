'use client'

import {
    fetchInstructorCoursesIndex,
    fetchInstructorDocumentsIndex,
    fetchInstructorExam,
    fetchInstructorExamsArchived,
    fetchMiscAvatarPacks,
    fetchTablesCompilers,
    instructorExamArchive,
    instructorExamRemove,
    instructorExamUnarchive,
    instructorExamUpdate,
    instructorExamUpdateCompilers,
    instructorExamUpdateDocuments,
} from '@/actions/instructor'
import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { useDynamic } from '@/hooks/use-dynamic'
import { showError } from '@/lib/instructor/utils'
import type {
    Compiler,
    Document,
    InstructorBriefCourse,
    InstructorExam,
    InstructorExamUpdate,
} from '@/lib/jutge_api_client'
import dayjs from 'dayjs'
import { CalendarPlusIcon, SaveIcon, TrashIcon } from 'lucide-react'
import { redirect, useParams } from 'next/navigation'
import { all, capitalize, sleep } from 'radash'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export function ExamPropertiesView() {
    const { exam_nm } = useParams<{ exam_nm: string }>()
    const [exam, setExam] = useState<InstructorExam | null>(null)
    const [compilers, setCompilers] = useState<Record<string, Compiler> | null>(null)
    const [documents, setDocuments] = useState<Record<string, Document> | null>(null)
    const [avatarPacks, setAvatarPacks] = useState<string[]>([])
    const [archived, setArchived] = useState(false)
    const [courses, setCourses] = useState<Record<string, InstructorBriefCourse>>({})

    const fetchData = useCallback(async () => {
        const data = await all({
            courses: fetchInstructorCoursesIndex(),
            exam: fetchInstructorExam(exam_nm),
            archived: fetchInstructorExamsArchived(),
            compilers: fetchTablesCompilers(),
            documents: fetchInstructorDocumentsIndex(),
            avatarPacks: fetchMiscAvatarPacks(),
        })
        setCourses(data.courses)
        setExam(data.exam)
        setArchived(data.archived.includes(exam_nm))
        setCompilers(data.compilers)
        setDocuments(data.documents)
        setAvatarPacks(data.avatarPacks)

        if (data.exam.course.course_nm === 'All') {
            toast.error(`Warning: Exam ${exam_nm} is not associated with a course. You may not start it!`)
        }
    }, [exam_nm])

    useEffect(() => {
        fetchData()
    }, [exam_nm, fetchData])

    if (!exam || !compilers || !documents) return <SimpleSpinner />

    if (exam.course.course_nm === 'All' && exam.course.title === 'All problems') {
        exam.course.course_nm = ''
        exam.course.title = ''
    }

    return (
        <EditExamForm
            fetchData={fetchData}
            exam={exam}
            courses={courses}
            archived={archived}
            setArchived={setArchived}
            allCompilers={compilers}
            allDocuments={documents}
            allAvatarPacks={avatarPacks}
        />
    )
}

interface ExamFormProps {
    fetchData: () => Promise<void>
    exam: InstructorExam
    courses: Record<string, InstructorBriefCourse>
    archived: boolean
    setArchived: (archived: boolean) => void
    allCompilers: Record<string, Compiler>
    allDocuments: Record<string, Document>
    allAvatarPacks: string[]
}

function EditExamForm(props: ExamFormProps) {
    const [runConfirmDialog, ConfirmDialogComponent] = useConfirmDialog({
        title: 'Delete exam',
        acceptIcon: <TrashIcon />,
        acceptLabel: 'Yes, delete',
        cancelLabel: 'No',
    })

    const [exam_nm] = useDynamic(props.exam.exam_nm, [props.exam])
    const [course_nm, setCourse_nm] = useDynamic(props.exam.course.course_nm || '', [props.exam])
    const [code, setCode] = useDynamic(props.exam.code || '', [props.exam])
    const [title, setTitle] = useDynamic(props.exam.title, [props.exam])
    const [place, setPlace] = useDynamic(props.exam.place, [props.exam])
    const [expectedStart, setExpectedStart] = useDynamic(props.exam.exp_time_start as string, [props.exam])
    const [runningTime, setRunningTime] = useDynamic(props.exam.running_time, [props.exam])
    const [description, setDescription] = useDynamic(props.exam.description, [props.exam])
    const [instructions, setInstructions] = useDynamic(props.exam.instructions, [props.exam])
    const [contest, setContest] = useDynamic(props.exam.contest != 0, [props.exam])
    const [anonymous, setAnonymous] = useDynamic(props.exam.anonymous != 0, [props.exam])
    const [visibleSubmissions, setVisibleSubmissions] = useDynamic(props.exam.visible_submissions != 0, [props.exam])
    const [avatarPack, setAvatarPack] = useDynamic(props.exam.avatars || '', [props.exam])
    const [documents, setDocuments] = useDynamic(
        props.exam.documents.map((d) => d.document_nm),
        [props.exam],
    )
    const [compilers, setCompilers] = useDynamic(
        props.exam.compilers.map((c) => c.compiler_id),
        [props.exam],
    )
    const [created_at] = useDynamic(dayjs(props.exam.created_at).format('YYYY-MM-DD HH:mm:ss'), [props.exam])
    const [updated_at] = useDynamic(dayjs(props.exam.updated_at).format('YYYY-MM-DD HH:mm:ss'), [props.exam])

    function optionCompare(a: { label: string; value: string }, b: { label: string; value: string }) {
        return a.label.localeCompare(b.label)
    }

    const fields: JFormFields = {
        title: {
            type: 'input',
            label: 'Title',
            value: title,
            setValue: setTitle,
            validator: z.string().min(8),
            placeHolder: 'Exam Title',
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
        course: {
            type: 'select',
            label: 'Course',
            value: course_nm,
            setValue: (v) => setCourse_nm(v ?? ''),
            options: [{ value: '', label: '—' }].concat(
                Object.entries(props.courses)
                    .map(([course_nm, course]) => ({
                        value: course_nm,
                        label: course.title,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label)),
            ),
        },
        place: {
            type: 'input',
            label: 'Place',
            value: place || '',
            setValue: setPlace,
            validator: z.string(),
            placeHolder: 'Where the exam will take place',
        },
        description: {
            type: 'markdown',
            label: 'Description',
            value: description || '',
            setValue: setDescription,
            placeHolder: 'Exam description',
            help: (
                <div>
                    The exam description will be available to all participants in the exam/contest, including in its
                    anouncement.
                </div>
            ),
        },
        instructions: {
            type: 'markdown',
            label: 'Instructions',
            value: instructions || '',
            setValue: setInstructions,
            placeHolder: 'Exam instructions',
            help: (
                <div>
                    The exam instructions will be available to all participants in the exam/contest once they log in the
                    exam and the exam has started.
                </div>
            ),
        },
        expectedStart: {
            type: 'datetime',
            label: 'Expected start time',
            value: expectedStart,
            setValue: setExpectedStart,
            placeHolder: 'When the exam is expected to start',
        },
        runningTime: {
            type: 'number',
            label: 'Running time (minutes)',
            value: runningTime,
            setValue: setRunningTime,
            placeHolder: 'How long the exam is expected to last',
            validator: z.number().min(1),
        },
        code: {
            type: 'input',
            label: 'Exam password',
            value: code,
            setValue: setCode,
            placeHolder: 'No password',
        },
        contest: {
            type: 'switch',
            label: 'Contest',
            value: contest,
            setValue: setContest,
        },
        anonymous: {
            type: 'switch',
            label: 'Anonymous',
            value: anonymous,
            setValue: setAnonymous,
        },
        avatarPack: {
            type: 'select',
            label: 'Avatar pack',
            value: avatarPack,
            setValue: (v) => setAvatarPack(v ?? ''),
            options: [{ value: '', label: '—' }].concat(
                props.allAvatarPacks
                    .map((pack) => ({ value: pack, label: capitalize(pack) }))
                    .sort((a, b) => a.label.localeCompare(b.label)),
            ),
        },
        compilers: {
            type: 'multiSelect',
            label: 'Compilers',
            value: compilers,
            setValue: setCompilers,
            options: Object.entries(props.allCompilers)
                .map(([compiler_id, compiler]) => ({
                    value: compiler_id,
                    label: compiler.name,
                }))
                .sort(optionCompare),
        },
        documents: {
            type: 'multiSelect',
            label: 'Documents',
            value: documents,
            setValue: setDocuments,
            options: Object.entries(props.allDocuments)
                .map(([document_id, document]) => ({
                    value: document_id,
                    label: document.title,
                }))
                .sort(optionCompare),
        },
        visibleSubmissions: {
            type: 'switch',
            label: 'Visible submissions',
            value: visibleSubmissions,
            setValue: setVisibleSubmissions,
            help: (
                <div>
                    If enabled, submissions <i>and</i> problems sent to an exam/contest will be visible from the regular
                    Jutge.org site. You probably don&apos;t want to have visible submissions until the end of the exam.
                </div>
            ),
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
        addToCal: {
            type: 'button',
            text: 'Add to calendar',
            icon: <CalendarPlusIcon />,
            action: addToCalendar,
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
        try {
            const newExam: InstructorExamUpdate = {
                exam_nm,
                course_nm: course_nm || '',
                title,
                code,
                place: place || '',
                exp_time_start: expectedStart,
                running_time: runningTime,
                description: description || '',
                instructions: instructions || '',
                contest: contest ? 1 : 0,
                anonymous: anonymous ? 1 : 0,
                visible_submissions: visibleSubmissions ? 1 : 0,
                avatars: avatarPack || '',
                time_start: props.exam.time_start,
                started_by: props.exam.started_by,
            }

            await instructorExamUpdate(newExam)
            await instructorExamUpdateDocuments({ exam_nm, document_nms: documents })
            await instructorExamUpdateCompilers({ exam_nm, compiler_ids: compilers })

            if (props.archived) await instructorExamArchive(exam_nm)
            else await instructorExamUnarchive(exam_nm)
        } catch (error) {
            return showError(error)
        }
        await props.fetchData()
        toast.success(`Exam '${exam_nm}' saved.`)
    }

    async function addToCalendar() {
        await sleep(0)
        window.open(examToCalendarLink(props.exam))
    }

    async function remove() {
        const message = `Are you sure you want to delete exam '${props.exam.exam_nm}'?`
        if (!(await runConfirmDialog(message))) return

        try {
            await instructorExamRemove(props.exam.exam_nm)
        } catch (error) {
            return showError(error)
        }
        toast.success(`Exam '${props.exam.exam_nm}' deleted.`)
        redirect('/instructor/exams')
    }

    return (
        <>
            <JForm fields={fields} />
            <ConfirmDialogComponent />
        </>
    )
}

function examToCalendarLink(exam: InstructorExam): string {
    const formatDate = (date: Date): string => {
        const isoString = date.toISOString().replace(/[-:]/g, '')
        return isoString.slice(0, 13) + isoString.slice(15, -1)
    }

    const startDate = new Date(exam.exp_time_start)
    const endDate = new Date(startDate.getTime() + exam.running_time * 60000)

    const dateS = formatDate(startDate)
    const dateE = formatDate(endDate)

    const text = encodeURIComponent(exam.title)
    const dates = `${dateS}/${dateE}`
    const location = encodeURIComponent(exam.place || 'unkwnown')

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}`
}
