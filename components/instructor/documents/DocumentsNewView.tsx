'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import { PlusCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { documentFileAccept } from '@/lib/instructor/documents'
import { showError } from '@/lib/instructor/utils'

export function DocumentsNewView() {
    const { client } = useJutgeAuth()

    const router = useRouter()
    const [document_nm, setDocument_nm] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const fields: JFormFields = {
        document_nm: {
            type: 'input',
            label: 'Id',
            value: document_nm,
            setValue: setDocument_nm,
            validator: z
                .string()
                .min(5)
                .regex(/^[a-zA-Z0-9_-]*$/, 'Only alphanumeric characters are allowed'),
            placeHolder: 'DocumentId',
        },
        title: {
            type: 'input',
            label: 'Title',
            value: title,
            setValue: setTitle,
            validator: z.string().min(5),
            placeHolder: 'Document Title',
        },
        description: {
            type: 'markdown',
            label: 'Description',
            value: description,
            setValue: setDescription,
            placeHolder: 'Document description',
        },
        file: {
            type: 'file',
            label: 'File',
            value: file,
            setValue: setFile,
            accept: documentFileAccept,
        },
        sep: { type: 'separator' },
        add: {
            type: 'button',
            text: 'Add document',
            icon: <PlusCircleIcon />,
            action: addAction,
        },
    }

    async function addAction() {
    const { client } = useJutgeAuth()

        const newDocument = {
            document_nm: document_nm,
            title: title,
            description: description,
        }
        try {
            await client.instructor.documents.create(newDocument, file!)
        } catch (error) {
            return showError(error)
        }
        toast.success(`Document '${document_nm}' created`)
        router.push('/instructor/documents')
    }

    return <JForm fields={fields} />
}
