'use client'

import dayjs from 'dayjs'
import { SaveIcon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createElement, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { fetchInstructorDocument, instructorDocumentRemove, instructorDocumentUpdate } from '@/actions/instructor'
import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { Button } from '@/components/ui/button'
import { useDynamic } from '@/hooks/use-dynamic'
import {
    documentFileAcceptForType,
    documentFileExtension,
    documentTypeLabel,
    getDocumentFile,
    getDocumentFileIcon,
} from '@/lib/instructor/documents'
import type { Document } from '@/lib/jutge_api_client'
import { offerDownloadFile, showError } from '@/lib/instructor/utils'

type DocumentPropertiesViewProps = {
    document_nm: string
}

export function DocumentPropertiesView({ document_nm }: DocumentPropertiesViewProps) {
    const [document, setDocument] = useState<Document | null>(null)

    const fetchData = useCallback(async () => {
        const document = await fetchInstructorDocument(document_nm)
        setDocument(document)
    }, [document_nm])

    useEffect(() => {
        fetchData()
    }, [document_nm, fetchData])

    if (!document) return <SimpleSpinner />

    return <EditDocumentForm fetchData={fetchData} document={document} />
}

interface DocumentFormProps {
    fetchData: () => Promise<void>
    document: Document
}

function EditDocumentForm(props: DocumentFormProps) {
    const router = useRouter()

    const [runConfirmDialog, ConfirmDialogComponent] = useConfirmDialog({
        title: 'Delete document',
        acceptIcon: <TrashIcon />,
        acceptLabel: 'Yes, delete',
        cancelLabel: 'No',
    })

    const [document_nm, setDocument_nm] = useDynamic(props.document.document_nm, [props.document])
    const [title, setTitle] = useDynamic(props.document.title, [props.document])
    const [created_at, setCreated_at] = useDynamic(dayjs(props.document.created_at).format('YYYY-MM-DD HH:mm:ss'), [
        props.document,
    ])
    const [updated_at, setUpdated_at] = useDynamic(dayjs(props.document.updated_at).format('YYYY-MM-DD HH:mm:ss'), [
        props.document,
    ])
    const [description, setDescription] = useDynamic(props.document.description, [props.document])
    const [file, setFile] = useDynamic(null as File | null, [props.document])

    const typeLabel = documentTypeLabel(props.document)

    const fields: JFormFields = {
        title: {
            type: 'input',
            label: 'Title',
            value: title,
            setValue: setTitle,
            validator: z.string().min(5),
            placeHolder: 'Document Title',
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
            placeHolder: 'Document description',
        },
        oldFile: {
            type: 'free',
            label: `Current ${typeLabel}`,
            content: (
                <Button variant="outline" className="h-16 w-16 [&_svg]:size-12" onClick={download}>
                    <FileIcon strokeWidth={0.6} />
                </Button>
            ),
        },
        file: {
            type: 'file',
            label: `New ${typeLabel}`,
            value: file,
            setValue: setFile,
            accept: documentFileAcceptForType(props.document.type),
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

    async function download() {
        try {
            const download = await getDocumentFile(props.document)
            offerDownloadFile(download, props.document.document_nm + documentFileExtension(props.document))
        } catch (error) {
            return showError(error)
        }
    }

    async function save() {
        try {
            const download = await getDocumentFile(props.document)
            const newDocument = {
                document_nm: document_nm,
                title: title,
                description: description,
            }
            const newFile = file ? file : new File([new Uint8Array(download.data)], download.name)

            await instructorDocumentUpdate(newDocument, newFile)
        } catch (error) {
            return showError(error)
        }
        await props.fetchData()
        toast.success(`Document '${props.document.document_nm}' saved.`)
    }

    async function remove() {
        const message = `Are you sure you want to delete document '${props.document.document_nm}'?`
        if (!(await runConfirmDialog(message))) return

        try {
            await instructorDocumentRemove(props.document.document_nm)
        } catch (error) {
            return showError(error)
        }
        toast.success(`Document '${props.document.document_nm}' deleted.`)
        router.push('/instructor/documents')
    }

    return (
        <>
            <JForm fields={fields} />
            <ConfirmDialogComponent />
        </>
    )
}
