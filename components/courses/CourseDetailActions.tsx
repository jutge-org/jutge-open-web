'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'
import { archiveCourse, enrollInCourse, unarchiveCourse, unenrollFromCourse } from '@/services/mutations/courses'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ArchiveIcon, ArchiveRestoreIcon, GraduationCap, Loader2, LogOutIcon, EllipsisVerticalIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { courseActionSuccessMessage, type CourseStatus, type CourseStudentAction } from '@/lib/courses'

const UNENROLL_CONFIRMATION =
    'Please take into account that, after unenrolling from it, your instructor will not be able to see your progress. This could have strong consequences in the event your grade depends on it. You can enroll it again at any time.'

type CourseAction = CourseStudentAction

type CourseDetailActionsProps = {
    courseKey: string
    title: string
    ownerName: string
    status: CourseStatus
}

export function CourseDetailActions({ courseKey, title, ownerName, status }: CourseDetailActionsProps) {
    const { client } = useJutgeAuth()
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [, startTransition] = useTransition()
    const [runConfirmDialog, ConfirmDialogComponent] = useConfirmDialog({
        title: 'Are you sure?',
        acceptLabel: 'Confirm',
        cancelLabel: 'Cancel',
    })
    const [runUnenrollDialog, UnenrollDialogComponent] = useConfirmDialog({
        title: 'Unenroll from course',
        acceptLabel: 'Unenroll',
        cancelLabel: 'Cancel',
    })

    async function handleAction(action: CourseAction) {
        let confirmed = false

        switch (action) {
            case 'enroll':
                confirmed = await runConfirmDialog(`Are you sure you want to enroll in “${title}”?`)
                break
            case 'archive':
                confirmed = await runConfirmDialog(`Are you sure you want to archive “${title}”?`)
                break
            case 'unarchive':
                confirmed = await runConfirmDialog(`Are you sure you want to unarchive “${title}”?`)
                break
            case 'unenroll':
                confirmed = await runUnenrollDialog(UNENROLL_CONFIRMATION)
                break
        }

        if (!confirmed) {
            return
        }

        setIsPending(true)
        startTransition(async () => {
            const result = await runCourseAction(client, courseKey, action)
            setIsPending(false)

            if (result.ok) {
                toast.success(courseActionSuccessMessage(action, title, ownerName))
                router.refresh()
                return
            }

            toast.error(result.error)
        })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        disabled={isPending}
                        aria-label={`Actions for ${title}`}
                    >
                        {isPending ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden />
                        ) : (
                            <EllipsisVerticalIcon className="size-4" aria-hidden />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {status === 'available' ? (
                        <DropdownMenuItem onClick={() => handleAction('enroll')}>
                            <GraduationCap aria-hidden />
                            Enroll
                        </DropdownMenuItem>
                    ) : null}
                    {status === 'enrolled' ? (
                        <>
                            <DropdownMenuItem onClick={() => handleAction('unenroll')}>
                                <LogOutIcon aria-hidden />
                                Unenroll
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('archive')}>
                                <ArchiveIcon aria-hidden />
                                Archive
                            </DropdownMenuItem>
                        </>
                    ) : null}
                    {status === 'archived' ? (
                        <>
                            <DropdownMenuItem onClick={() => handleAction('unenroll')}>
                                <LogOutIcon aria-hidden />
                                Unenroll
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('unarchive')}>
                                <ArchiveRestoreIcon aria-hidden />
                                Unarchive
                            </DropdownMenuItem>
                        </>
                    ) : null}
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDialogComponent />
            <UnenrollDialogComponent />
        </>
    )
}

async function runCourseAction(
    client: ReturnType<typeof useJutgeAuth>['client'],
    courseKey: string,
    action: CourseAction,
): Promise<{ ok: true } | { ok: false; error: string }> {
    const trimmed = courseKey.trim()
    if (!trimmed) {
        return { ok: false, error: 'Course key is required.' }
    }

    try {
        switch (action) {
            case 'enroll':
                await enrollInCourse(client, trimmed)
                break
            case 'unenroll':
                await unenrollFromCourse(client, trimmed)
                break
            case 'archive':
                await archiveCourse(client, trimmed)
                break
            case 'unarchive':
                await unarchiveCourse(client, trimmed)
                break
        }
        return { ok: true }
    } catch (e) {
        const message =
            e instanceof Error
                ? e.message
                : action === 'enroll'
                  ? 'Failed to enroll in course.'
                  : action === 'unenroll'
                    ? 'Failed to unenroll from course.'
                    : action === 'archive'
                      ? 'Failed to archive course.'
                      : 'Failed to unarchive course.'
        return { ok: false, error: message }
    }
}
