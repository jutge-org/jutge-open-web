'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { showError } from '@/lib/instructor/utils'
import { CloudUploadIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function ProblemUpdateView() {
    const { client } = useJutgeAuth()

    const { problem_nm } = useParams<{ problem_nm: string }>()
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)

    const fields: JFormFields = {
        title: {
            type: 'free',
            label: '',
            content: (
                <div className="mb-8 space-y-2 rounded-lg border p-4 text-sm">
                    <p>Update problem {problem_nm} by uploading a ZIP archive with its content.</p>
                </div>
            ),
        },
        file: {
            type: 'file',
            label: 'ZIP archive',
            value: file,
            setValue: setFile,
            accept: ['application/zip'],
        },
        sep: { type: 'separator' },
        add: {
            type: 'button',
            text: 'Update problem',
            icon: <CloudUploadIcon />,
            action: updateAction,
        },
    }

    async function updateAction() {
    const { client } = useJutgeAuth()

        if (!file) {
            toast.error('Please select a ZIP archive.')
            return
        }

        try {
            const { id } = await client.instructor.problems.update(problem_nm, file)
            router.push(`/instructor/problems/${problem_nm}/update/${id}`)
        } catch (error) {
            showError(error)
        }
    }

    return <JForm fields={fields} />
}
