'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ArchiveIcon, ArchiveRestoreIcon, EditIcon, GraduationCap, Loader2, LogOutIcon, EllipsisVerticalIcon } from 'lucide-react'
import { toast } from 'sonner'

import { archiveCourseAction, enrollCourseAction, unarchiveCourseAction, unenrollCourseAction } from '@/actions/courses'
import { useConfirmDialog } from '@/components/administrator/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { courseActionSuccessMessage, instructorCoursePropertiesHref, type CourseStatus, type CourseStudentAction } from '@/lib/courses'

const UNENROLL_CONFIRMATION =
    'Please take into account that, after unenrolling from it, your instructor will not be able to see your progress. This could have strong consequences in the event your grade depends on it. You can enroll it again at any time.'

type CourseAction = CourseStudentAction

type CourseDetailActionsProps = {
    courseKey: string
    title: string
    ownerName: string
    status: CourseStatus
    isOwner: boolean
}

export function CourseDetailActions({ courseKey, title, ownerName, status, isOwner }: CourseDetailActionsProps) {
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
            const result = await runServerAction(courseKey, action)
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
                    {isOwner ? (
                        <DropdownMenuItem asChild>
                            <Link href={instructorCoursePropertiesHref(courseKey)}>
                                <EditIcon aria-hidden />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                    ) : null}
                    {status === 'available' ? (
                        <DropdownMenuItem onClick={() => handleAction('enroll')}>
                            <GraduationCap aria-hidden />
                            Enroll
                        </DropdownMenuItem>
                    ) : null}
                    {status === 'enrolled' ? (
                        <>
                            {!isOwner ? (
                                <DropdownMenuItem onClick={() => handleAction('unenroll')}>
                                    <LogOutIcon aria-hidden />
                                    Unenroll
                                </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem onClick={() => handleAction('archive')}>
                                <ArchiveIcon aria-hidden />
                                Archive
                            </DropdownMenuItem>
                        </>
                    ) : null}
                    {status === 'archived' ? (
                        <>
                            {!isOwner ? (
                                <DropdownMenuItem onClick={() => handleAction('unenroll')}>
                                    <LogOutIcon aria-hidden />
                                    Unenroll
                                </DropdownMenuItem>
                            ) : null}
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

async function runServerAction(courseKey: string, action: CourseAction) {
    switch (action) {
        case 'enroll':
            return enrollCourseAction(courseKey)
        case 'unenroll':
            return unenrollCourseAction(courseKey)
        case 'archive':
            return archiveCourseAction(courseKey)
        case 'unarchive':
            return unarchiveCourseAction(courseKey)
    }
}
