'use client'

import { fetchInstructorList, instructorListCreate } from '@/lib/instructor/client'
import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { showError } from '@/lib/instructor/utils'
import type { InstructorList } from '@/lib/jutge_api_client'
import { CopyPlusIcon } from 'lucide-react'
import { redirect, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export function ListDuplicateView() {
    const { list_nm } = useParams<{ list_nm: string }>()
    const [list, setList] = useState<InstructorList | null>(null)

    useEffect(() => {
        async function fetchList() {
            const list = await fetchInstructorList(list_nm)
            setList(list)
        }

        fetchList()
    }, [list_nm])

    if (list === null) return <SimpleSpinner />

    return <ListDuplicateForm list={list} />
}

function ListDuplicateForm({ list }: { list: InstructorList }) {
    const [newNm, setNewNm] = useState(list.list_nm + '_copy')
    const [newTitle, setNewTitle] = useState('Copy of ' + list.title)

    const fields: JFormFields = {
        intro: {
            type: 'free',
            label: '',
            content: (
                <div className="text-sm mb-4">
                    <p>
                        In order to duplicate this list into a new list, please provide a new list identifier and a new
                        title.
                    </p>
                </div>
            ),
        },
        newNm: {
            type: 'input',
            label: 'Id',
            value: newNm,
            setValue: setNewNm,
            validator: z
                .string()
                .min(5)
                .regex(/^[a-zA-Z0-9_]*$/, 'Only letters, digits and underscores (_) are allowed'),
            placeHolder: 'NewListName',
        },
        title: {
            type: 'input',
            label: 'Title',
            value: newTitle,
            setValue: setNewTitle,
            validator: z.string().min(5),
            placeHolder: 'New List Title',
        },
        sep: { type: 'separator' },
        update: {
            type: 'button',
            text: 'Duplicate list',
            icon: <CopyPlusIcon />,
            action: duplicateAction,
        },
    }

    async function duplicateAction() {
        const oldCurse: InstructorList = await fetchInstructorList(list.list_nm)
        const newList = {
            ...oldCurse,
            list_nm: newNm,
            title: newTitle,
        }

        try {
            await instructorListCreate(newList)
        } catch (error) {
            return showError(error)
        }
        toast.success(`List '${list.list_nm}' duplicated as '${newNm}'.`)
        redirect(`/instructor/lists/${newNm}/properties`)
    }

    return <JForm fields={fields} />
}
