'use client'

import { EyeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { storeSupervisionCoursePreference } from '@/lib/supervision'

type SuperviseCourseMenuItemProps = {
    userId: string
    courseKey: string
}

export function SuperviseCourseMenuItem({ userId, courseKey }: SuperviseCourseMenuItemProps) {
    const router = useRouter()

    return (
        <DropdownMenuItem
            onClick={() => {
                storeSupervisionCoursePreference(userId, courseKey)
                router.push('/supervision')
            }}
        >
            <EyeIcon aria-hidden />
            Supervise
        </DropdownMenuItem>
    )
}
