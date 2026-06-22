'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import Dropzone from 'shadcn-dropzone'
import { filesize } from 'filesize'
import { CloudUploadIcon, SaveIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

import { updateProfileAvatarAction } from '@/actions/profile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type UserProfileAvatarFormProps = {
    avatarDataUrl: string | null
}

export function UserProfileAvatarForm({ avatarDataUrl }: UserProfileAvatarFormProps) {
    const router = useRouter()
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(avatarDataUrl)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    useEffect(() => {
        if (!avatarFile) {
            setAvatarPreviewUrl(avatarDataUrl)
            return
        }

        const objectUrl = URL.createObjectURL(avatarFile)
        setAvatarPreviewUrl(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [avatarFile, avatarDataUrl])

    function handleAvatarDrop(addedFiles: File[]) {
        if (addedFiles.length < 1) return

        const file = addedFiles[addedFiles.length - 1]
        if (file.type !== 'image/png') {
            setErrorMessage('Avatar must be a PNG image.')
            return
        }

        setAvatarFile(file)
        setErrorMessage(null)
    }

    function clearAvatarSelection() {
        setAvatarFile(null)
        setErrorMessage(null)
    }

    function handleSave() {
        setErrorMessage(null)

        if (!avatarFile) {
            setErrorMessage('Please select a PNG image to upload.')
            return
        }

        startTransition(async () => {
            const result = await updateProfileAvatarAction(avatarFile)
            if (!result.ok) {
                setErrorMessage(result.error)
                return
            }

            toast.success('Avatar saved.')
            setAvatarFile(null)
            router.refresh()
        })
    }

    return (
        <div className="w-full">
            <section className="w-full rounded-xl border border-border bg-card p-6 shadow-xs">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <Label>Current avatar</Label>
                        {avatarPreviewUrl ? (
                            <div className="flex justify-center sm:justify-start">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={avatarPreviewUrl}
                                    alt="Avatar preview"
                                    className="size-32 rounded-xl object-cover"
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No avatar uploaded yet.</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>New avatar</Label>
                        <Dropzone accept={{ 'image/png': ['.png'] }} maxFiles={1} onDrop={handleAvatarDrop}>
                            {() => (
                                <div className="flex h-28 w-full flex-col items-center justify-center rounded-lg px-4 text-xs text-muted-foreground">
                                    <CloudUploadIcon className="size-8 stroke-[1.5]" aria-hidden />
                                    <div className="pt-2 text-center">
                                        Drag and drop a PNG image here <b>or</b> click to select.
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                        {avatarFile ? (
                            <div className="flex flex-row items-center gap-2 rounded border p-1 text-sm">
                                <Badge variant="secondary" className="min-w-0 truncate">
                                    {avatarFile.name}
                                </Badge>
                                <Badge variant="secondary">{filesize(avatarFile.size, { standard: 'jedec' })}</Badge>
                                <div className="grow" />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={clearAvatarSelection}
                                    aria-label="Remove avatar selection"
                                >
                                    <TrashIcon />
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={pending || !avatarFile}
                        className="w-full gap-2 sm:w-auto"
                    >
                        <SaveIcon className="size-4" />
                        {pending ? 'Saving…' : 'Save'}
                    </Button>
                </div>
            </section>
        </div>
    )
}
