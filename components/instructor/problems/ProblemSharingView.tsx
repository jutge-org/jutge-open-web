'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import { showError } from '@/lib/instructor/utils'
import { SaveIcon, Share2Icon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const passcodeRegex = /^[a-zA-Z0-9]{8,}$/
const passcodeSchema = z.string().refine((v) => v.trim() === '' || passcodeRegex.test(v.trim()), {
    message: 'Passcode must be at least 8 characters long and contain only letters and digits.',
})

function parseEmailList(raw: string): string[] {
    const seen = new Set<string>()
    const out: string[] = []
    for (const part of raw.split(/[\s,;]+/)) {
        const e = part.trim().toLowerCase()
        if (e && !seen.has(e)) {
            seen.add(e)
            out.push(e)
        }
    }
    return out
}

const shareEmailsSchema = z.string().refine((v) => parseEmailList(v).length > 0, {
    message: 'Enter at least one email address.',
})

type SharingSettingsFormProps = {
    problem_nm: string
    passcodeInput: string
    setPasscodeInput: (v: string) => void
    sharedTestcases: boolean
    setSharedTestcases: (v: boolean) => void
    sharedSolutions: boolean
    setSharedSolutions: (v: boolean) => void
    onSave: () => Promise<void>
}

function SharingSettingsForm({
    problem_nm,
    passcodeInput,
    setPasscodeInput,
    sharedTestcases,
    setSharedTestcases,
    sharedSolutions,
    setSharedSolutions,
    onSave,
}: SharingSettingsFormProps) {
    const fields: JFormFields = {
        title: {
            type: 'free',
            label: '',
            content: (
                <div className="mb-8 space-y-2 rounded-lg border p-4 text-sm">
                    <p>Set the sharing settings of problem {problem_nm} with the form below.</p>
                </div>
            ),
        },
        passcodeSection: {
            type: 'input',
            label: 'Passcode',
            value: passcodeInput,
            setValue: setPasscodeInput,
            placeHolder: 'No passcode',
            validator: passcodeSchema,
            help: 'Leave empty for no passcode (problem visible to all). With a passcode, the problem is only visible to users with the correct passcode.',
        },
        sharedTestcases: {
            type: 'switch',
            label: 'Shared testcases',
            value: sharedTestcases,
            setValue: setSharedTestcases,
            help: 'Share testcases with other instructors.',
        },
        sharedSolutions: {
            type: 'switch',
            label: 'Shared solutions',
            value: sharedSolutions,
            setValue: setSharedSolutions,
            help: 'Share solutions with other instructors.',
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

type ShareWithEmailsFormProps = {
    problem_nm: string
    shareEmailsInput: string
    setShareEmailsInput: (v: string) => void
    shareMessageInput: string
    setShareMessageInput: (v: string) => void
    onShare: () => Promise<void>
}

function ShareWithEmailsForm({
    problem_nm,
    shareEmailsInput,
    setShareEmailsInput,
    shareMessageInput,
    setShareMessageInput,
    onShare,
}: ShareWithEmailsFormProps) {
    const fields: JFormFields = {
        shareTitle: {
            type: 'free',
            label: '',
            content: (
                <div className="mb-4 space-y-2 rounded-lg border p-4 text-sm">
                    <p>Share this problem to other users via their emails.</p>
                </div>
            ),
        },
        shareEmails: {
            type: 'textarea',
            label: 'Emails',
            value: shareEmailsInput,
            setValue: setShareEmailsInput,
            placeHolder: 'Enter each email on a line',
            rows: 4,
            validator: shareEmailsSchema,
        },
        shareMessage: {
            type: 'textarea',
            label: 'Additional text',
            value: shareMessageInput,
            setValue: setShareMessageInput,
            placeHolder: 'Optional message to include in the email',
            rows: 3,
        },
        shareSep: { type: 'separator' },
        shareBtn: {
            type: 'button',
            text: 'Share',
            icon: <Share2Icon />,
            action: onShare,
        },
    }
    return <JForm fields={fields} />
}

export function ProblemSharingView() {
    const { client } = useJutgeAuth()

    const { problem_nm } = useParams<{ problem_nm: string }>()
    const [loading, setLoading] = useState(true)
    const [passcode, setPasscode] = useState<string | null>(null)
    const [sharedTestcases, setSharedTestcases] = useState(false)
    const [sharedSolutions, setSharedSolutions] = useState(false)
    const [passcodeInput, setPasscodeInput] = useState('')
    const [shareEmailsInput, setShareEmailsInput] = useState('')
    const [shareMessageInput, setShareMessageInput] = useState('')

    useEffect(() => {
        async function fetchSharing() {
    const { client } = useJutgeAuth()

            const settings = await client.instructor.problems.getSharingSettings(problem_nm)
            setPasscode(settings.passcode)
            setSharedTestcases(settings.shared_testcases)
            setSharedSolutions(settings.shared_solutions)
            setPasscodeInput(settings.passcode || '')
            setLoading(false)
        }
        fetchSharing()
    }, [problem_nm])

    if (loading) return <SimpleSpinner size={64} className="pt-24" />

    async function saveSharing() {
    const { client } = useJutgeAuth()

        const trimmed = passcodeInput.trim()
        const newPasscode = trimmed === '' ? null : trimmed
        if (newPasscode !== null) {
            const result = passcodeSchema.safeParse(passcodeInput)
            if (!result.success) {
                toast.error(result.error.issues[0]?.message || 'Invalid passcode.')
                return
            }
        }
        try {
            await client.instructor.problems.setSharingSettings({
                problem_nm,
                passcode: newPasscode,
                shared_testcases: sharedTestcases,
                shared_solutions: sharedSolutions,
            })
            setPasscode(newPasscode)
            toast.success('Sharing settings saved.')
        } catch (error) {
            showError(error)
        }
    }

    async function shareWithEmails() {
    const { client } = useJutgeAuth()

        const emails = parseEmailList(shareEmailsInput)
        if (emails.length === 0) {
            toast.error('Enter at least one email address.')
            return
        }
        const invalid = emails.filter((e) => !z.string().email().safeParse(e).success)
        if (invalid.length > 0) {
            toast.error(`Invalid email(s): ${invalid.join(', ')}`)
            return
        }
        try {
            await client.instructor.problems.shareWith({
                problem_nm,
                emails,
                text: shareMessageInput.trim(),
            })
            toast.success('Problem shared with the given addresses.')
        } catch (error) {
            showError(error)
        }
    }

    const canShareByEmail = passcode != null && passcode !== ''

    return (
        <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="settings">Sharing settings</TabsTrigger>
                <TabsTrigger value="share">Share by email</TabsTrigger>
            </TabsList>
            <TabsContent value="settings" className="mt-4">
                <SharingSettingsForm
                    problem_nm={problem_nm}
                    passcodeInput={passcodeInput}
                    setPasscodeInput={setPasscodeInput}
                    sharedTestcases={sharedTestcases}
                    setSharedTestcases={setSharedTestcases}
                    sharedSolutions={sharedSolutions}
                    setSharedSolutions={setSharedSolutions}
                    onSave={saveSharing}
                />
            </TabsContent>
            <TabsContent value="share" className="mt-4">
                {canShareByEmail ? (
                    <ShareWithEmailsForm
                        problem_nm={problem_nm}
                        shareEmailsInput={shareEmailsInput}
                        setShareEmailsInput={setShareEmailsInput}
                        shareMessageInput={shareMessageInput}
                        setShareMessageInput={setShareMessageInput}
                        onShare={shareWithEmails}
                    />
                ) : (
                    <div className="space-y-2 rounded-lg border p-4 text-sm text-muted-foreground">
                        <p>This problem has no passcode.</p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    )
}
