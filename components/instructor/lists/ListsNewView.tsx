'use client'

import { instructorListCreate } from '@/lib/instructor/client'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { showError } from '@/lib/instructor/utils'
import { PlusCircleIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export function ListsNewView() {
    const [list_nm, setList_nm] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [annotation, setAnnotation] = useState('')

    const fields: JFormFields = {
        list_nm: {
            type: 'input',
            label: 'Id',
            value: list_nm,
            setValue: setList_nm,
            validator: z
                .string()
                .min(5)
                .regex(/^[a-zA-Z0-9_]*$/, 'Only letters, digits and underscores (_) are allowed'),
            placeHolder: 'ListId',
        },
        title: {
            type: 'input',
            label: 'Title',
            value: title,
            setValue: setTitle,
            validator: z.string().min(5),
            placeHolder: 'List Title',
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
            placeHolder: 'List Annotation',
        },
        sep: { type: 'separator' },
        add: {
            type: 'button',
            text: 'Add list',
            icon: <PlusCircleIcon />,
            action: addAction,
        },
    }

    async function addAction() {
        const newList = {
            list_nm,
            title,
            description,
            annotation,
            official: 0,
            public: 0,
            items: [],
        }
        try {
            await instructorListCreate(newList)
        } catch (error) {
            return showError(error)
        }
        toast.success(`List '${list_nm}' created.`)
        redirect(`/instructor/lists/${list_nm}/properties`)
    }

    return <JForm fields={fields} />
}
