'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ClockIcon, ScrollTextIcon, SignatureIcon } from 'lucide-react'
import { type ReactNode } from 'react'

import { CourseIconImage } from '@/components/courses/CourseIconImage'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { courseIconUrl } from '@/lib/courses'

dayjs.extend(relativeTime)

type CourseTitleSummaryTooltipProps = {
    title: string
    iconUrl?: string
    ownerName?: string
    description?: string
    accessedAt?: number
    children?: ReactNode
}

function CourseTitleRow({ title, iconUrl }: { title: string; iconUrl: string }) {
    return (
        <div className="flex w-full min-w-0 items-center gap-2 font-bold">
            <CourseIconImage iconUrl={iconUrl} size="xs" className="rounded" />
            <span className="min-w-0 truncate">{title || 'Untitled course'}</span>
        </div>
    )
}

function CourseSummaryTooltipBody({
    title,
    iconUrl,
    ownerName,
    description,
    accessedAt,
}: {
    title: string
    iconUrl: string
    ownerName?: string
    description?: string
    accessedAt?: number
}) {
    return (
        <div className="flex w-full flex-col gap-1 p-2 text-sm">
            <CourseTitleRow title={title} iconUrl={iconUrl} />
            {ownerName ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <SignatureIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full">{ownerName}</div>
                </div>
            ) : null}
            {description ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <ScrollTextIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full whitespace-pre-wrap">{description}</div>
                </div>
            ) : null}
            {accessedAt !== undefined ? (
                <div className="flex w-full flex-row">
                    <div className="w-8 shrink-0">
                        <ClockIcon className="mb-1 mr-1 inline-block" size={16} aria-hidden />
                    </div>
                    <div className="w-full">Accessed {dayjs(accessedAt).fromNow()}</div>
                </div>
            ) : null}
        </div>
    )
}

export function CourseTitleSummaryTooltip({
    title,
    iconUrl,
    ownerName,
    description,
    accessedAt,
    children,
}: CourseTitleSummaryTooltipProps) {
    const resolvedIconUrl = iconUrl ?? courseIconUrl(null)

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children ?? <span className="cursor-default truncate">{title}</span>}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex w-96 max-w-sm flex-col items-start px-3 py-2 text-left">
                <CourseSummaryTooltipBody
                    title={title}
                    iconUrl={resolvedIconUrl}
                    ownerName={ownerName}
                    description={description}
                    accessedAt={accessedAt}
                />
            </TooltipContent>
        </Tooltip>
    )
}
