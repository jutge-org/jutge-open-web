'use client'

import { SaveFileIconButton } from '@/components/instructor/statistics/SaveFileIconButton'
import { ButtonGroup } from '@/components/ui/button-group'
import { FileDownIcon, ImageDownIcon } from 'lucide-react'

type StatisticsSaveButtonGroupProps = {
    onSaveSvg: () => void | Promise<void>
    onSaveCsv: () => void | Promise<void>
    disabled?: boolean
}

export function StatisticsSaveButtonGroup({ onSaveSvg, onSaveCsv, disabled }: StatisticsSaveButtonGroupProps) {
    return (
        <ButtonGroup>
            <SaveFileIconButton
                onClick={onSaveSvg}
                disabled={disabled}
                tooltip="Save chart as SVG"
                aria-label="Save chart as SVG"
                icon={ImageDownIcon}
            />
            <SaveFileIconButton
                onClick={onSaveCsv}
                disabled={disabled}
                tooltip="Save table as CSV"
                aria-label="Save table as CSV"
                icon={FileDownIcon}
            />
        </ButtonGroup>
    )
}
