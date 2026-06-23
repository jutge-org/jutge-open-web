'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { showError } from '@/lib/instructor/utils'
import type { AbstractProblem } from '@/lib/jutge_api_client'
import { AlertTriangleIcon, SaveIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const REMOVE_MAX_SUBMISSIONS = 6

type DeprecationFormProps = {
    problem_nm: string
    reason: string
    setReason: (v: string) => void
    onSave: () => Promise<void>
}

function DeprecationForm({ problem_nm, reason, setReason, onSave }: DeprecationFormProps) {
    const fields: JFormFields = {
        title: {
            type: 'free',
            label: '',
            content: (
                <div className="mb-8 space-y-2 rounded-lg border p-4 text-sm">
                    <p>Deprecate or undeprecate problem {problem_nm} with the form below.</p>
                </div>
            ),
        },
        deprecationSection: {
            type: 'input',
            label: 'Deprecation reason',
            value: reason,
            setValue: setReason,
            placeHolder: 'Not deprecated',
            help: 'Leave empty for a non-deprecated problem. To deprecate, enter a short reason (e.g. superseded by another problem or no longer relevant).',
        },
        sep: { type: 'separator' },
        save: {
            type: 'button',
            text: 'Save',
            icon: <SaveIcon />,
            action: onSave,
        },
    }
    return <JForm fields={fields} />
}

type RemoveProblemFormProps = {
    problem_nm: string
    totalSubmissions: number
    canRemove: boolean
    removeConfirmName: string
    setRemoveConfirmName: (v: string) => void
    removeConfirmCheckbox: boolean
    setRemoveConfirmCheckbox: (v: boolean) => void
    onRemove: () => Promise<void>
}

function RemoveProblemForm({
    problem_nm,
    totalSubmissions,
    canRemove,
    removeConfirmName,
    setRemoveConfirmName,
    removeConfirmCheckbox,
    setRemoveConfirmCheckbox,
    onRemove,
}: RemoveProblemFormProps) {
    const removeConfirmValidator = z.string().refine((s) => s.trim() === problem_nm, {
        message: 'The name does not match the problem name',
    })
    const removeCheckboxValidator = z.boolean().refine((v) => v === true, {
        message: 'You must confirm the removal',
    })

    const fields: JFormFields = {
        removeTitle: {
            type: 'free',
            label: '',
            content: (
                <div className="mb-8 space-y-2 rounded-lg border p-4 text-sm">
                    <AlertTriangleIcon />
                    <p>
                        Problems can only be removed if they have fewer than {REMOVE_MAX_SUBMISSIONS} submissions. This
                        problem has <strong>{totalSubmissions}</strong> submission
                        {totalSubmissions !== 1 ? 's' : ''}.
                    </p>
                    <p>
                        Removing a problem is irreversible. Problems cannot be restored after removal. The problem will
                        be deleted from the system and all associated data (e.g. submissions, lists, courses, exams,
                        etc.) will be lost forever.
                    </p>
                    {!canRemove ? (
                        <p>
                            Removal not allowed. Consider deprecating the problem instead. If you really want to remove
                            this problem, please contact the administrators.
                        </p>
                    ) : (
                        <p className="text-destructive">
                            Check the checkbox and type the problem name ({problem_nm}) to confirm removal.
                        </p>
                    )}
                </div>
            ),
        },
        removeCheckbox: {
            type: 'switch',
            label: 'I confirm the removal',
            help: 'Check the checkbox to confirm the removal. You understand that this action is irreversible.',
            value: removeConfirmCheckbox,
            setValue: setRemoveConfirmCheckbox,
            validator: removeCheckboxValidator,
        },
        removeConfirm: {
            type: 'input',
            label: <>Problem name</>,
            help: 'Type the problem name to confirm removal. You understand that this action is irreversible.',
            value: removeConfirmName,
            setValue: setRemoveConfirmName,
            placeHolder: '',
            validator: removeConfirmValidator,
        },
        removeSep: { type: 'separator' },
        removeBtn: {
            type: 'button',
            text: 'Remove problem',
            icon: <TrashIcon />,
            action: onRemove,
        },
    }
    return <JForm fields={fields} />
}

export function ProblemDangerZoneView() {
    const { client } = useJutgeAuth()

    const { problem_nm } = useParams<{ problem_nm: string }>()
    const router = useRouter()
    const [abstractProblem, setAbstractProblem] = useState<AbstractProblem | null>(null)
    const [submissions, setSubmissions] = useState<number | null>(null)
    const [reason, setReason] = useState('')
    const [removeConfirmName, setRemoveConfirmName] = useState('')
    const [removeConfirmCheckbox, setRemoveConfirmCheckbox] = useState(false)

    useEffect(() => {
        async function fetchData() {
    const { client } = useJutgeAuth()

            const [abstractProblemData, submissionsData] = await Promise.all([
                client.problems.getAbstractProblem(problem_nm),
                client.instructor.problems.getAnonymousSubmissions(problem_nm),
            ])
            setAbstractProblem(abstractProblemData)
            setSubmissions(submissionsData.length)
            setReason(abstractProblemData.deprecation || '')
        }
        fetchData()
    }, [problem_nm])

    if (abstractProblem === null || submissions === null) return <SimpleSpinner size={64} className="pt-24" />

    const totalSubmissions = submissions
    const canRemove = totalSubmissions < REMOVE_MAX_SUBMISSIONS

    async function saveDeprecation() {
    const { client } = useJutgeAuth()

        const trimmed = reason.trim()
        try {
            if (trimmed === '') {
                await client.instructor.problems.setDeprecation({ problem_nm, reason: null })
                toast.success('Problem undeprecated.')
            } else {
                await client.instructor.problems.setDeprecation({ problem_nm, reason: trimmed })
                toast.success('Problem deprecated.')
            }
            const updated = await client.problems.getAbstractProblem(problem_nm)
            setAbstractProblem(updated)
            setReason(updated.deprecation || '')
        } catch (error) {
            showError(error)
        }
    }

    async function removeProblem() {
    const { client } = useJutgeAuth()

        if (!removeConfirmCheckbox) {
            toast.error('You must confirm the removal with the switch.')
            return
        }
        if (!canRemove) {
            toast.error(
                `This problem has ${totalSubmissions} submissions. Problems can only be removed if they have fewer than ${REMOVE_MAX_SUBMISSIONS} submissions.`,
            )
            return
        }
        try {
            await client.instructor.problems.remove(problem_nm)
            toast.success('Problem removed.')
            router.push('/instructor/problems')
        } catch (error) {
            showError(error)
        }
    }

    return (
        <Tabs defaultValue="deprecation" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="deprecation">Deprecation</TabsTrigger>
                <TabsTrigger value="remove">Removal</TabsTrigger>
            </TabsList>
            <TabsContent value="deprecation" className="mt-4">
                <DeprecationForm
                    problem_nm={problem_nm}
                    reason={reason}
                    setReason={setReason}
                    onSave={saveDeprecation}
                />
            </TabsContent>
            <TabsContent value="remove" className="mt-4">
                <RemoveProblemForm
                    problem_nm={problem_nm}
                    totalSubmissions={totalSubmissions}
                    canRemove={canRemove}
                    removeConfirmName={removeConfirmName}
                    setRemoveConfirmName={setRemoveConfirmName}
                    removeConfirmCheckbox={removeConfirmCheckbox}
                    setRemoveConfirmCheckbox={setRemoveConfirmCheckbox}
                    onRemove={removeProblem}
                />
            </TabsContent>
        </Tabs>
    )
}
