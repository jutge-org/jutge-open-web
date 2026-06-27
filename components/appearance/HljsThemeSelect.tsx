'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEFAULT_HLJS_THEME, formatHljsThemeLabel, HLJS_THEMES, type HljsThemeSelection } from '@/lib/hljsThemes'

type HljsThemeSelectProps = {
    id: string
    value: HljsThemeSelection
    onValueChange: (theme: HljsThemeSelection) => void
}

function formatHljsSelectionLabel(theme: HljsThemeSelection): string {
    if (theme === DEFAULT_HLJS_THEME) {
        return 'Auto (match app theme)'
    }

    return formatHljsThemeLabel(theme)
}

export function HljsThemeSelect({ id, value, onValueChange }: HljsThemeSelectProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>Highlighted code theme</Label>
            <Select value={value} onValueChange={(nextValue) => onValueChange(nextValue as HljsThemeSelection)}>
                <SelectTrigger id={id} className="w-full">
                    <SelectValue>{formatHljsSelectionLabel(value)}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-72">
                    <SelectItem value={DEFAULT_HLJS_THEME}>Auto (match app theme)</SelectItem>
                    <SelectGroup>
                        <SelectLabel>Themes</SelectLabel>
                        {HLJS_THEMES.map((theme) => (
                            <SelectItem key={theme} value={theme}>
                                {formatHljsThemeLabel(theme)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
