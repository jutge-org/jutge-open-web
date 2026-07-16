'use client'

import { HljsThemeSelect } from '@/components/appearance/HljsThemeSelect'
import { APPEARANCE_SETTINGS_OPEN_EVENT } from '@/lib/appearanceSettings'
import { MonacoThemeSelect } from '@/components/appearance/MonacoThemeSelect'
import { useAppearancePreferences, useAppearanceThemePreference } from '@/components/AppearancePreferencesProvider'
import { useLayoutWidth } from '@/components/layout/LayoutWidthProvider'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LAYOUT_WIDTH_CONSTRAINED, LAYOUT_WIDTH_FULL, LAYOUT_WIDTH_WIDE, type LayoutWidth } from '@/lib/layoutWidth'
import {
    MAX_PAGE_BACKGROUND,
    MIN_PAGE_BACKGROUND,
    pageBackgroundImageUrl,
} from '@/lib/pageBackground'
import { READING_FONT_SCALE_PRESETS, readingFontScalePresetFromScales } from '@/lib/readingFontScale'
import { REDUCED_MOTION_FULL, REDUCED_MOTION_REDUCE, REDUCED_MOTION_SYSTEM } from '@/lib/reducedMotion'
import { SOUND_EFFECTS_OFF, SOUND_EFFECTS_ON, type SoundEffectsPreference } from '@/lib/soundEffects'
import type { ThemePreference } from '@/lib/openWebSettings'
import { cn } from '@/lib/utils'
import {
    AccessibilityIcon,
    AArrowDownIcon,
    AArrowUpIcon,
    ALargeSmallIcon,
    MonitorIcon,
    MoonIcon,
    RectangleHorizontalIcon,
    RotateCcwIcon,
    ScanTextIcon,
    Settings2Icon,
    SquareIcon,
    StretchHorizontalIcon,
    SunIcon,
    Volume2Icon,
    VolumeXIcon,
    ZapIcon,
    XIcon,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { toast } from 'sonner'

type AppearanceSettingsDialogProps = {
    size?: 'icon' | 'icon-sm'
}

type SettingSectionProps = {
    title: string
    description: string
    children: ReactNode
}

function SettingSection({ title, description, children }: SettingSectionProps) {
    return (
        <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{title}</legend>
            <p className="text-sm text-muted-foreground">{description}</p>
            {children}
        </fieldset>
    )
}

type SegmentedOptionProps = {
    value: string
    label: string
    icon: ReactNode
    className?: string
}

const READING_FONT_SCALE_ICONS: Record<string, ReactNode> = {
    '0.85': <AArrowDownIcon className="size-4" aria-hidden />,
    '1': <ALargeSmallIcon className="size-4" aria-hidden />,
    '1.25': <AArrowUpIcon className="size-4" aria-hidden />,
    '1.5': <ScanTextIcon className="size-4" aria-hidden />,
}

function readingFontScalePresetIcon(value: string) {
    return READING_FONT_SCALE_ICONS[value] ?? <ALargeSmallIcon className="size-4" aria-hidden />
}

function SegmentedOption({ value, label, icon, className }: SegmentedOptionProps) {
    return (
        <ToggleGroupItem
            value={value}
            aria-label={label}
            className={cn(
                'flex h-auto min-h-16 flex-col items-center justify-center gap-1.5 px-2 py-3 text-xs font-normal',
                className,
            )}
        >
            {icon}
            <span>{label}</span>
        </ToggleGroupItem>
    )
}

export function AppearanceSettingsDialog({ size = 'icon' }: AppearanceSettingsDialogProps) {
    const [theme, setTheme] = useAppearanceThemePreference()
    const { layoutWidth, setLayoutWidth } = useLayoutWidth()
    const {
        monacoTheme,
        setMonacoTheme,
        hljsTheme,
        setHljsTheme,
        fontScales,
        setReadingFontScalePreset,
        reducedMotion,
        setReducedMotion,
        soundEffects,
        setSoundEffects,
        background,
        setBackground,
        resetAppearanceDefaults,
    } = useAppearancePreferences()
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    const readingFontScalePreset = readingFontScalePresetFromScales(fontScales)

    useEffect(() => {
        queueMicrotask(() => setMounted(true))
    }, [])

    useEffect(() => {
        function onOpenRequest() {
            setOpen(true)
        }

        window.addEventListener(APPEARANCE_SETTINGS_OPEN_EVENT, onOpenRequest)
        return () => window.removeEventListener(APPEARANCE_SETTINGS_OPEN_EVENT, onOpenRequest)
    }, [])

    function handleResetDefaults() {
        resetAppearanceDefaults()
        toast.success('Appearance settings reset to defaults')
    }

    function closeDialog() {
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size={size} aria-label="Appearance settings">
                                <Settings2Icon className="size-4.5" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Appearance settings</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {mounted ? (
                <DialogContent className="flex max-h-[75vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0">
                    <DialogHeader className="shrink-0 px-6 pt-6">
                        <DialogTitle>Appearance</DialogTitle>
                        <DialogDescription>
                            Customize the appearance of Jutge.org to your needs and liking.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 overflow-y-auto px-6 py-6">
                        <SettingSection title="Theme" description="Choose a color theme for the interface.">
                            <ToggleGroup
                                type="single"
                                variant="outline"
                                spacing={0}
                                value={theme ?? 'system'}
                                onValueChange={(value) => value && setTheme(value as ThemePreference)}
                                className="grid w-full grid-cols-3"
                            >
                                <SegmentedOption
                                    value="system"
                                    label="System"
                                    icon={<MonitorIcon className="size-4" aria-hidden />}
                                />
                                <SegmentedOption
                                    value="light"
                                    label="Light"
                                    icon={<SunIcon className="size-4" aria-hidden />}
                                />
                                <SegmentedOption
                                    value="dark"
                                    label="Dark"
                                    icon={<MoonIcon className="size-4" aria-hidden />}
                                />
                            </ToggleGroup>
                        </SettingSection>
                        <SettingSection
                            title="Page width"
                            description="Choose how wide the main content area should be."
                        >
                            <ToggleGroup
                                type="single"
                                variant="outline"
                                spacing={0}
                                value={layoutWidth}
                                onValueChange={(value) => value && setLayoutWidth(value as LayoutWidth)}
                                className="grid w-full grid-cols-3"
                            >
                                <SegmentedOption
                                    value={LAYOUT_WIDTH_CONSTRAINED}
                                    label="Comfortable"
                                    icon={<SquareIcon className="size-4" aria-hidden />}
                                />
                                <SegmentedOption
                                    value={LAYOUT_WIDTH_WIDE}
                                    label="Wide"
                                    icon={<RectangleHorizontalIcon className="size-4" aria-hidden />}
                                />
                                <SegmentedOption
                                    value={LAYOUT_WIDTH_FULL}
                                    label="Full"
                                    icon={<StretchHorizontalIcon className="size-4" aria-hidden />}
                                />
                            </ToggleGroup>
                        </SettingSection>
                        <SettingSection
                            title="Reading text size"
                            description="Adjust text size for problem statements, test cases, and source code."
                        >
                            <ToggleGroup
                                type="single"
                                variant="outline"
                                spacing={0}
                                value={readingFontScalePreset ?? ''}
                                onValueChange={(value) => {
                                    if (!value) {
                                        return
                                    }

                                    const preset = READING_FONT_SCALE_PRESETS.find((option) => option.value === value)
                                    if (preset) {
                                        setReadingFontScalePreset(preset.scale)
                                    }
                                }}
                                className="grid w-full grid-cols-4"
                            >
                                {READING_FONT_SCALE_PRESETS.map((preset) => (
                                    <SegmentedOption
                                        key={preset.value}
                                        value={preset.value}
                                        label={preset.label}
                                        icon={readingFontScalePresetIcon(preset.value)}
                                        className="min-h-14"
                                    />
                                ))}
                            </ToggleGroup>
                            {!readingFontScalePreset ? (
                                <p className="text-xs text-muted-foreground">
                                    Custom sizes are set per page. Choose a preset to apply the same size everywhere.
                                </p>
                            ) : null}
                        </SettingSection>
                        <SettingSection
                            title="Background"
                            description="Choose a page background image. Set to 0 for none."
                        >
                            <div className="flex items-center gap-3">
                                <Slider
                                    min={MIN_PAGE_BACKGROUND}
                                    max={MAX_PAGE_BACKGROUND}
                                    step={1}
                                    value={[background]}
                                    onValueChange={(value) => setBackground(value[0] ?? MIN_PAGE_BACKGROUND)}
                                    aria-label="Background"
                                    className="flex-1"
                                />
                                <span className="w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                                    {background === 0 ? 'None' : background}
                                </span>
                            </div>
                            {background > 0 ? (
                                <div
                                    className="mt-1 h-20 w-full overflow-hidden rounded-md border border-border bg-muted bg-cover bg-center"
                                    style={{ backgroundImage: `url(${pageBackgroundImageUrl(background)})` }}
                                    role="img"
                                    aria-label={`Background preview ${background}`}
                                />
                            ) : null}
                        </SettingSection>
                        <SettingSection
                            title="Sound effects"
                            description="Play sounds for celebratory moments and feedback."
                        >
                            <ToggleGroup
                                type="single"
                                variant="outline"
                                spacing={0}
                                value={soundEffects}
                                onValueChange={(value) => value && setSoundEffects(value as SoundEffectsPreference)}
                                className="grid w-full grid-cols-2"
                            >
                                <SegmentedOption
                                    value={SOUND_EFFECTS_ON}
                                    label="On"
                                    icon={<Volume2Icon className="size-4" aria-hidden />}
                                />
                                <SegmentedOption
                                    value={SOUND_EFFECTS_OFF}
                                    label="Off"
                                    icon={<VolumeXIcon className="size-4" aria-hidden />}
                                />
                            </ToggleGroup>
                        </SettingSection>
                        <SettingSection title="Motion" description="Control animations and transitions.">
                            <ToggleGroup
                                type="single"
                                variant="outline"
                                spacing={0}
                                value={reducedMotion}
                                onValueChange={(value) =>
                                    value &&
                                    setReducedMotion(
                                        value as
                                            | typeof REDUCED_MOTION_SYSTEM
                                            | typeof REDUCED_MOTION_REDUCE
                                            | typeof REDUCED_MOTION_FULL,
                                    )
                                }
                                className="grid w-full grid-cols-3"
                            >
                                <SegmentedOption
                                    value={REDUCED_MOTION_SYSTEM}
                                    label="System"
                                    icon={<MonitorIcon className="size-4" aria-hidden />}
                                />
                                <SegmentedOption
                                    value={REDUCED_MOTION_REDUCE}
                                    label="Reduce"
                                    icon={<AccessibilityIcon className="size-4" aria-hidden />}
                                />
                                <SegmentedOption
                                    value={REDUCED_MOTION_FULL}
                                    label="Full"
                                    icon={<ZapIcon className="size-4" aria-hidden />}
                                />
                            </ToggleGroup>
                        </SettingSection>
                        <SettingSection
                            title="Code syntax"
                            description="Choose themes for highlighted and editable code."
                        >
                            <div className="space-y-4">
                                <HljsThemeSelect
                                    id="appearance-hljs-theme"
                                    value={hljsTheme}
                                    onValueChange={setHljsTheme}
                                />
                                <MonacoThemeSelect
                                    id="appearance-monaco-theme"
                                    value={monacoTheme}
                                    onValueChange={setMonacoTheme}
                                />
                            </div>
                        </SettingSection>
                    </div>
                    <div className="shrink-0 border-t border-border px-6 py-4">
                        <div className="w-full flex flex-row gap-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={handleResetDefaults}>
                                <RotateCcwIcon className="size-4" aria-hidden />
                                Reset to defaults
                            </Button>
                            <Button type="button" className="flex-1" onClick={closeDialog}>
                                <XIcon className="size-4" aria-hidden />
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            ) : null}
        </Dialog>
    )
}
