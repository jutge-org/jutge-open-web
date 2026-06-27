'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    DEFAULT_MONACO_THEME,
    formatMonacoThemeLabel,
    MONACO_BUILTIN_THEMES,
    MONACO_CUSTOM_THEMES,
    type MonacoThemeSelection,
} from '@/lib/monaco/themes'

type MonacoThemeSelectProps = {
    id: string
    value: MonacoThemeSelection
    onValueChange: (theme: MonacoThemeSelection) => void
}

function formatMonacoSelectionLabel(theme: MonacoThemeSelection): string {
    if (theme === DEFAULT_MONACO_THEME) {
        return 'Auto (match app theme)'
    }

    return formatMonacoThemeLabel(theme)
}

export function MonacoThemeSelect({ id, value, onValueChange }: MonacoThemeSelectProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>Editor theme</Label>
            <Select value={value} onValueChange={(nextValue) => onValueChange(nextValue as MonacoThemeSelection)}>
                <SelectTrigger id={id} className="w-full">
                    <SelectValue>{formatMonacoSelectionLabel(value)}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-72">
                    <SelectItem value={DEFAULT_MONACO_THEME}>Auto (match app theme)</SelectItem>
                    <SelectGroup>
                        <SelectLabel>Built-in</SelectLabel>
                        {MONACO_BUILTIN_THEMES.map((theme) => (
                            <SelectItem key={theme} value={theme}>
                                {formatMonacoThemeLabel(theme)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>Custom</SelectLabel>
                        {MONACO_CUSTOM_THEMES.map((theme) => (
                            <SelectItem key={theme} value={theme}>
                                {formatMonacoThemeLabel(theme)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
