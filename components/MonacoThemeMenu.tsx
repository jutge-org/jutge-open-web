'use client'

import { PaletteIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    DEFAULT_MONACO_THEME,
    formatMonacoThemeLabel,
    MONACO_BUILTIN_THEMES,
    MONACO_CUSTOM_THEMES,
    type MonacoThemeSelection,
} from '@/lib/monaco/themes'

type MonacoThemeMenuProps = {
    value: MonacoThemeSelection
    onValueChange: (theme: MonacoThemeSelection) => void
    onThemePreview?: (theme: MonacoThemeSelection) => void
    onOpenChange?: (open: boolean) => void
    size?: 'icon' | 'icon-sm'
    groupedSlot?: ReactNode
}

type ThemeMenuItemProps = {
    theme: MonacoThemeSelection
    onThemePreview?: (theme: MonacoThemeSelection) => void
    children: ReactNode
}

function ThemeMenuItem({ theme, onThemePreview, children }: ThemeMenuItemProps) {
    function handlePreview() {
        onThemePreview?.(theme)
    }

    return (
        <DropdownMenuRadioItem value={theme} onPointerEnter={handlePreview} onFocus={handlePreview}>
            {children}
        </DropdownMenuRadioItem>
    )
}

export function MonacoThemeMenu({
    value,
    onValueChange,
    onThemePreview,
    onOpenChange,
    size = 'icon',
    groupedSlot,
}: MonacoThemeMenuProps) {
    const trigger = (
        <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size={size} aria-label="Change editor theme">
                <PaletteIcon className="size-[1.125rem]" />
            </Button>
        </DropdownMenuTrigger>
    )

    return (
        <DropdownMenu onOpenChange={onOpenChange}>
            {groupedSlot ? (
                <ButtonGroup>
                    {trigger}
                    {groupedSlot}
                </ButtonGroup>
            ) : (
                trigger
            )}
            <DropdownMenuContent align="end" className="w-56 p-0">
                <ScrollArea className="h-72">
                    <div className="p-1">
                        <DropdownMenuLabel>Editor theme</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={value}
                            onValueChange={(nextValue) => onValueChange(nextValue as MonacoThemeSelection)}
                        >
                            <ThemeMenuItem theme={DEFAULT_MONACO_THEME} onThemePreview={onThemePreview}>
                                Auto
                            </ThemeMenuItem>
                            {MONACO_BUILTIN_THEMES.map((theme) => (
                                <ThemeMenuItem key={theme} theme={theme} onThemePreview={onThemePreview}>
                                    {formatMonacoThemeLabel(theme)}
                                </ThemeMenuItem>
                            ))}
                            {MONACO_CUSTOM_THEMES.map((theme) => (
                                <ThemeMenuItem key={theme} theme={theme} onThemePreview={onThemePreview}>
                                    {formatMonacoThemeLabel(theme)}
                                </ThemeMenuItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </div>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
