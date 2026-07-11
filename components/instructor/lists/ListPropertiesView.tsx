'use client'

import {
    fetchAllAbstractProblems,
    fetchInstructorList,
    fetchInstructorListsArchived,
    instructorListArchive,
    instructorListRemove,
    instructorListUnarchive,
    instructorListUpdate,
} from '@/lib/instructor/client'
import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { useDynamic } from '@/hooks/use-dynamic'
import { showError } from '@/lib/instructor/utils'
import type { InstructorList } from '@/lib/jutge_api_client'
import dayjs from 'dayjs'
import { SaveIcon, TrashIcon } from 'lucide-react'
import { redirect, useParams } from 'next/navigation'
import { all } from 'radash'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export function ListPropertiesView() {
    const { list_nm } = useParams<{ list_nm: string }>()
    const [list, setList] = useState<InstructorList | null>(null)
    const [archived, setArchived] = useState(false)

    const fetchData = useCallback(async () => {
        const data = await all({
            list: fetchInstructorList(list_nm),
            archived: fetchInstructorListsArchived(),
        })
        setList(data.list)
        setArchived(data.archived.includes(list_nm))
    }, [list_nm])

    useEffect(() => {
        fetchData()
        fetchAllAbstractProblems()
    }, [list_nm, fetchData])

    if (list === null) return <SimpleSpinner size={64} className="pt-24" />

    return <ListPropertiesForm fetchData={fetchData} list={list} archived={archived} setArchived={setArchived} />
}

type ListPropertiesFormProps = {
    list: InstructorList
    archived: boolean
    setArchived: (archived: boolean) => void
    fetchData: () => Promise<void>
}

function ListPropertiesForm(props: ListPropertiesFormProps) {
    const [runConfirmDialog, ConfirmDialogComponent] = useConfirmDialog({
        title: 'Delete list',
        acceptIcon: <TrashIcon />,
        acceptLabel: 'Yes, delete',
        cancelLabel: 'No',
    })

    const [list_nm] = useDynamic(props.list.list_nm, [props.list])
    const [title, setTitle] = useDynamic(props.list.title, [props.list])
    const [description, setDescription] = useDynamic(props.list.description, [props.list])
    const [annotation, setAnnotation] = useDynamic(props.list.annotation, [props.list])
    const [created_at] = useDynamic(dayjs(props.list.created_at).format('YYYY-MM-DD HH:mm:ss'), [props.list])
    const [updated_at] = useDynamic(dayjs(props.list.updated_at).format('YYYY-MM-DD HH:mm:ss'), [props.list])

    const fields: JFormFields = {
        title: {
            type: 'input',
            label: 'Title',
            value: title,
            setValue: setTitle,
            validator: z.string().min(5),
            placeHolder: 'List Title',
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
            placeHolder: 'List description',
        },
        annotation: {
            type: 'input',
            label: 'Annotation',
            value: annotation,
            setValue: setAnnotation,
            validator: z.string(),
            placeHolder: 'List annotation (instructor only)',
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
        const oldCurse = await fetchInstructorList(list_nm)
        const newList = {
            ...oldCurse,
            title,
            description,
            annotation,
        }

        try {
            await instructorListUpdate(newList)

            if (props.archived) await instructorListArchive(list_nm)
            else await instructorListUnarchive(list_nm)
        } catch (error) {
            return showError(error)
        }
        await props.fetchData()
        toast.success(`List '${props.list.list_nm}' saved.`)
    }

    async function remove() {
        const message = `Are you sure you want to delete list '${props.list.list_nm}'?`
        if (!(await runConfirmDialog(message))) return

        try {
            await instructorListRemove(props.list.list_nm)
        } catch (error) {
            return showError(error)
        }
        toast.success(`List '${props.list.list_nm}' deleted.`)
        redirect('/instructor/lists')
    }

    return (
        <>
            <JForm fields={fields} />
            <ConfirmDialogComponent />
        </>
    )
}
