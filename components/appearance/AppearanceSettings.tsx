'use client'

import { HljsThemeSelect } from '@/components/appearance/HljsThemeSelect'
import { MonacoThemeSelect } from '@/components/appearance/MonacoThemeSelect'
import { useAppearancePreferences, useAppearanceThemePreference } from '@/components/AppearancePreferencesProvider'
import { useLayoutWidth } from '@/components/layout/LayoutWidthProvider'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LAYOUT_WIDTH_CONSTRAINED, LAYOUT_WIDTH_FULL, LAYOUT_WIDTH_WIDE, type LayoutWidth } from '@/lib/layoutWidth'
import { READING_FONT_SCALE_PRESETS, readingFontScalePresetFromScales } from '@/lib/readingFontScale'
import { REDUCED_MOTION_FULL, REDUCED_MOTION_REDUCE, REDUCED_MOTION_SYSTEM } from '@/lib/reducedMotion'
import { SOUND_EFFECTS_OFF, SOUND_EFFECTS_ON, type SoundEffectsPreference } from '@/lib/soundEffects'
import {
    CONTEXTUAL_HEADER_GRADIENTS_OFF,
    CONTEXTUAL_HEADER_GRADIENTS_ON,
    type ContextualHeaderGradientsPreference,
} from '@/lib/contextualHeaderGradients'
import type { ThemePreference } from '@/lib/openWebSettings'
import { cn } from '@/lib/utils'
import {
    AccessibilityIcon,
    AArrowDownIcon,
    AArrowUpIcon,
    ALargeSmallIcon,
    BlendIcon,
    MonitorIcon,
    MoonIcon,
    RectangleHorizontalIcon,
    RotateCcwIcon,
    ScanTextIcon,
    SquareIcon,
    StretchHorizontalIcon,
    SunIcon,
    Volume2Icon,
    VolumeXIcon,
    ZapIcon,
} from 'lucide-react'
import { type ReactNode } from 'react'
import { toast } from 'sonner'

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

type AppearanceSettingsProps = {
    className?: string
}

export function AppearanceSettings({ className }: AppearanceSettingsProps) {
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
        contextualHeaderGradients,
        setContextualHeaderGradients,
        resetAppearanceDefaults,
    } = useAppearancePreferences()

    const readingFontScalePreset = readingFontScalePresetFromScales(fontScales)

    function handleResetDefaults() {
        resetAppearanceDefaults()
        toast.success('Appearance settings reset to defaults')
    }

    return (
        <div className={cn('space-y-6', className)}>
            <SettingSection title="Theme" description="Choose a color theme for the interface.">
                <ToggleGroup
                    type="single"
                    variant="outline"
                    spacing={0}
                    value={theme ?? 'system'}
                    onValueChange={(value) => value && setTheme(value as ThemePreference)}
                    className="grid w-full grid-cols-3"
                >
                    <SegmentedOption value="system" label="System" icon={<MonitorIcon className="size-4" aria-hidden />} />
                    <SegmentedOption value="light" label="Light" icon={<SunIcon className="size-4" aria-hidden />} />
                    <SegmentedOption value="dark" label="Dark" icon={<MoonIcon className="size-4" aria-hidden />} />
                </ToggleGroup>
            </SettingSection>
            <SettingSection title="Page width" description="Choose how wide the main content area should be.">
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
            <SettingSection title="Sound effects" description="Play sounds for celebratory moments and feedback.">
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
            <SettingSection title="Code syntax" description="Choose themes for highlighted and editable code.">
                <div className="space-y-4">
                    <HljsThemeSelect id="appearance-hljs-theme" value={hljsTheme} onValueChange={setHljsTheme} />
                    <MonacoThemeSelect id="appearance-monaco-theme" value={monacoTheme} onValueChange={setMonacoTheme} />
                </div>
            </SettingSection>
            <SettingSection
                title="Contextual header"
                description="Tint the header bar on administrator, instructor, and supervision pages."
            >
                <ToggleGroup
                    type="single"
                    variant="outline"
                    spacing={0}
                    value={contextualHeaderGradients}
                    onValueChange={(value) =>
                        value && setContextualHeaderGradients(value as ContextualHeaderGradientsPreference)
                    }
                    className="grid w-full grid-cols-2"
                >
                    <SegmentedOption
                        value={CONTEXTUAL_HEADER_GRADIENTS_ON}
                        label="On"
                        icon={<BlendIcon className="size-4" aria-hidden />}
                    />
                    <SegmentedOption
                        value={CONTEXTUAL_HEADER_GRADIENTS_OFF}
                        label="Off"
                        icon={<SquareIcon className="size-4" aria-hidden />}
                    />
                </ToggleGroup>
            </SettingSection>
            <div className="pt-2">
                <Button type="button" variant="outline" onClick={handleResetDefaults}>
                    <RotateCcwIcon className="size-4" aria-hidden />
                    Reset to defaults
                </Button>
            </div>
        </div>
    )
}
