import { aboutIndexItems } from '@/lib/about'
import { documentationIndexItems } from '@/lib/documentation'
import { includesForSearch } from '@/lib/utils'

export type CommandPaletteSectionArea = 'documentation' | 'about'

export type CommandPaletteSection = {
    label: string
    description: string
    href: string
    area: CommandPaletteSectionArea
    external?: boolean
}

export const commandPaletteSections: CommandPaletteSection[] = [
    {
        label: 'Documentation',
        description: 'Documentation index for Jutge.org',
        href: '/documentation',
        area: 'documentation',
    },
    ...documentationIndexItems.map((item) => ({
        label: item.label,
        description: item.description,
        href: item.href,
        area: 'documentation' as const,
        ...('external' in item ? { external: item.external } : {}),
    })),
    {
        label: 'About',
        description: 'About Jutge.org',
        href: '/about',
        area: 'about',
    },
    ...aboutIndexItems.map((item) => ({
        label: item.label,
        description: item.description,
        href: item.href,
        area: 'about' as const,
        ...('external' in item ? { external: item.external } : {}),
    })),
]

function buildSectionSearchHaystack(section: CommandPaletteSection): string {
    return `${section.label} ${section.description}`
}

export function filterCommandPaletteSections(
    sections: CommandPaletteSection[],
    query: string,
): CommandPaletteSection[] {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
        return []
    }

    return sections.filter((section) => includesForSearch(buildSectionSearchHaystack(section), trimmedQuery))
}
