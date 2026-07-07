'use client'

import FloatingToolbar from '@/components/instructor/FloatingToolbar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { CalendarIcon, CheckIcon, RotateCcwIcon, SettingsIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type DatePickerFieldProps = {
    label: string
    value: Date
    onChange: (d: Date | undefined) => void
}

function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-[160px] justify-start text-left font-normal',
                            !value && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? dayjs(value).format('YYYY-MM-DD') : <span>{label}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={value} onSelect={onChange} />
                </PopoverContent>
            </Popover>
        </div>
    )
}

type CourseStatisticsPeriodDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    startDate: Date
    endDate: Date
    defaultStartDate: Date
    defaultEndDate: Date
    onAccept: (startDate: Date, endDate: Date) => void
}

export function CourseStatisticsPeriodDialog({
    open,
    onOpenChange,
    startDate,
    endDate,
    defaultStartDate,
    defaultEndDate,
    onAccept,
}: CourseStatisticsPeriodDialogProps) {
    const [draftStartDate, setDraftStartDate] = useState<Date>(() => startDate)
    const [draftEndDate, setDraftEndDate] = useState<Date>(() => endDate)

    useEffect(() => {
        if (open) {
            setDraftStartDate(startDate)
            setDraftEndDate(endDate)
        }
    }, [open, startDate, endDate])

    const handleResetDraft = () => {
        setDraftStartDate(defaultStartDate)
        setDraftEndDate(defaultEndDate)
    }

    const handleAccept = () => {
        onAccept(draftStartDate, draftEndDate)
        onOpenChange(false)
    }

    return (
        <FloatingToolbar>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        size="icon"
                        variant="default"
                        className="h-14 w-14 rounded-full"
                        aria-label="Open statistics period settings"
                    >
                        <SettingsIcon className="h-6 w-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Statistics period</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-wrap items-end gap-2 py-2">
                        <DatePickerField
                            label="Start date"
                            value={draftStartDate}
                            onChange={(d) => d != null && setDraftStartDate(d)}
                        />
                        <DatePickerField
                            label="End date"
                            value={draftEndDate}
                            onChange={(d) => d != null && setDraftEndDate(d)}
                        />
                    </div>
                    <DialogFooter className="flex flex-col gap-0">
                        <Button variant="outline" onClick={handleResetDraft} className="w-full">
                            <RotateCcwIcon className="h-4 w-4" />
                            Reset
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full">
                                <XIcon className="h-4 w-4" />
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={handleAccept} className="w-full">
                            <CheckIcon className="h-4 w-4" />
                            Accept
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </FloatingToolbar>
    )
}
