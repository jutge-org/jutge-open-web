import { aboutIndexItems } from '@/lib/about'
import { documentationIndexItems } from '@/lib/documentation'
import {
    getSiteNavLinkDescription,
    getSiteNavLinks,
    type SiteNavLinksContext,
} from '@/lib/siteNavLinks'
import { includesForSearch } from '@/lib/utils'

export type CommandPaletteSectionArea = 'app' | 'documentation' | 'about'

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

export function getCommandPaletteAppSections(context: SiteNavLinksContext): CommandPaletteSection[] {
    return getSiteNavLinks(context).map((link) => ({
        label: link.label,
        description: getSiteNavLinkDescription(link.href, context),
        href: link.href,
        area: 'app' as const,
    }))
}

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
