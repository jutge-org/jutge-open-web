'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ExternalLink } from '@/components/ExternalLink'
import { aboutNavItems } from '@/lib/about'
import { administratorIndexItems } from '@/lib/administrator'
import { documentationNavItems } from '@/lib/documentation'
import { instructorIndexItems } from '@/lib/instructor'
import {
    getSiteNavLinks,
    homeLink,
    pathsHrefEqual,
    type SiteNavLink,
    type SiteNavLinksContext,
} from '@/lib/siteNavLinks'
import { cn } from '@/lib/utils'
import { useMainBreadcrumbs } from '@/store/MainBreadcrumbs'
import {
    AccessibilityIcon,
    Award,
    AudioLinesIcon,
    BookMarkedIcon,
    BookOpen,
    BookOpenCheckIcon,
    BookText,
    ActivityIcon,
    BotIcon,
    BoxesIcon,
    CalendarIcon,
    CameraIcon,
    ChartPieIcon,
    Code2Icon,
    FileCode2Icon,
    FileIcon,
    FilePenIcon,
    FileTextIcon,
    GavelIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    MegaphoneIcon,
    ScrollTextIcon,
    SendIcon,
    FileBracesCornerIcon,
    CrownIcon,
    GraduationCap,
    House,
    SchoolIcon,
    Info,
    MenuIcon,
    SearchIcon,
    ShieldIcon,
    StampIcon,
    StethoscopeIcon,
    TableIcon,
    TrophyIcon,
    UserRoundPenIcon,
    UsersIcon,
    User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, type ComponentType } from 'react'

type MainBreadcrumbsInLayoutProps = SiteNavLinksContext & {
    enrolledCoursesNavItems?: readonly { href: string; label: string }[]
}

function orderMainNavMenuLinks(links: readonly SiteNavLink[]): SiteNavLink[] {
    const documentation = links.find((l) => l.href === '/documentation')
    const about = links.find((l) => l.href === '/about')
    const withoutMeta = links.filter((l) => l.href !== '/about' && l.href !== '/documentation')
    const metaLinks = [documentation, about].filter((l): l is SiteNavLink => l != null)
    return [homeLink, ...withoutMeta, ...metaLinks]
}

function MainNavMenuItemIcon({ href }: { href: string }) {
    switch (href) {
        case '/':
            return <House aria-hidden />
        case '/problems':
            return <FileBracesCornerIcon aria-hidden />
        case '/submissions':
            return <SendIcon aria-hidden />
        case '/exams':
            return <SchoolIcon aria-hidden />
        case '/courses':
            return <BookOpen aria-hidden />
        case '/activity':
            return <ActivityIcon aria-hidden />
        case '/awards':
            return <Award aria-hidden />
        case '/profile':
            return <User aria-hidden />
        case '/instructor':
            return <GraduationCap aria-hidden />
        case '/administrator':
            return <CrownIcon aria-hidden />
        case '/documentation':
            return <BookText aria-hidden />
        case '/about':
            return <Info aria-hidden />
        default:
            return null
    }
}

function MainNavCoursesSubItemIcon() {
    return <BookOpenCheckIcon aria-hidden />
}

function MainNavInstructorSubItemIcon({ href }: { href: string }) {
    switch (href) {
        case '/instructor/courses':
            return <TableIcon aria-hidden />
        case '/instructor/lists':
            return <ListIcon aria-hidden />
        case '/instructor/exams':
            return <FilePenIcon aria-hidden />
        case '/instructor/documents':
            return <FileIcon aria-hidden />
        case '/instructor/problems':
            return <FileBracesCornerIcon aria-hidden />
        case '/instructor/search':
            return <SearchIcon aria-hidden />
        case '/instructor/jutgeai':
            return <BotIcon aria-hidden />
        default:
            return null
    }
}

function MainNavAdministratorSubItemIcon({ href }: { href: string }) {
    switch (href) {
        case '/administrator/dashboard':
            return <LayoutDashboardIcon aria-hidden />
        case '/administrator/queue':
            return <ScrollTextIcon aria-hidden />
        case '/administrator/exams':
            return <CalendarIcon aria-hidden />
        case '/administrator/users':
            return <UsersIcon aria-hidden />
        case '/administrator/instructors':
            return <UserRoundPenIcon aria-hidden />
        case '/administrator/courses':
            return <BookOpenCheckIcon aria-hidden />
        case '/administrator/statistics':
            return <ChartPieIcon aria-hidden />
        case '/administrator/heatmaps':
            return <AudioLinesIcon aria-hidden />
        case '/administrator/ranking':
            return <TrophyIcon aria-hidden />
        default:
            return null
    }
}

function MainNavDocumentationSubItemIcon({ href }: { href: string }) {
    switch (href) {
        case '/documentation/faq':
            return <HelpCircleIcon aria-hidden />
        case '/documentation/compilers':
            return <Code2Icon aria-hidden />
        case '/documentation/verdicts':
            return <GavelIcon aria-hidden />
        case '/documentation/code-metrics':
            return <StethoscopeIcon aria-hidden />
        case '/documentation/pylibs':
            return <BoxesIcon aria-hidden />
        case '/documentation/certificates':
            return <StampIcon aria-hidden />
        case '/documentation/markdown':
            return <FileCode2Icon aria-hidden />
        case '/documentation/references':
            return <BookMarkedIcon aria-hidden />
        default:
            return null
    }
}

function MainNavAboutSubItemIcon({ href }: { href: string }) {
    switch (href) {
        case 'https://t.me/jutge':
            return <SendIcon aria-hidden />
        case '/about/terms-of-service':
            return <MegaphoneIcon aria-hidden />
        case '/about/honor-code':
            return <ShieldIcon aria-hidden />
        case '/about/accessibility':
            return <AccessibilityIcon aria-hidden />
        case '/about/pictures':
            return <CameraIcon aria-hidden />
        case '/about/publications':
            return <FileTextIcon aria-hidden />
        case '/about/credits':
            return <Info aria-hidden />
        default:
            return null
    }
}

const documentationSubmenuItems = documentationNavItems
    .filter((item) => item.tab !== 'index')
    .map(({ href, label, external }) => ({ href, label, external }))

const aboutSubmenuItems = aboutNavItems
    .filter((item) => item.tab !== 'index')
    .map(({ href, label, external }) => ({ href, label, external }))

function navSubItemIsCurrent(pathname: string, href: string, indexHref: string): boolean {
    if (href === indexHref) return pathname === indexHref
    return pathname === href || pathname.startsWith(`${href}/`)
}

type MainNavRoleSubmenuProps = {
    href: string
    label: string
    indexHref: string
    items: readonly { href: string; label: string; external?: boolean }[]
    pathname: string
    isCurrentSection: boolean
    subItemIcon: ComponentType<{ href: string }>
}

function MainNavRoleSubmenu({
    href,
    label,
    indexHref,
    items,
    pathname,
    isCurrentSection,
    subItemIcon: SubItemIcon,
}: MainNavRoleSubmenuProps) {
    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className={cn(isCurrentSection && 'font-semibold text-foreground')}>
                <MainNavMenuItemIcon href={href} />
                {label}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent className="min-w-52 shadow-lg **:data-[slot=dropdown-menu-item]:py-1.5 **:data-[slot=dropdown-menu-item]:text-base">
                    <DropdownMenuItem asChild>
                        <Link
                            href={indexHref}
                            className={cn(navSubItemIsCurrent(pathname, indexHref, indexHref) && 'text-foreground')}
                        >
                            <MainNavMenuItemIcon href={href} />
                            Index
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {items.map((item) =>
                        item.external ? (
                            <DropdownMenuItem asChild key={item.href}>
                                <ExternalLink href={item.href}>
                                    <SubItemIcon href={item.href} />
                                    {item.label}
                                </ExternalLink>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem asChild key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        navSubItemIsCurrent(pathname, item.href, indexHref) &&
                                            'font-semibold text-foreground',
                                    )}
                                >
                                    <SubItemIcon href={item.href} />
                                    {item.label}
                                </Link>
                            </DropdownMenuItem>
                        ),
                    )}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
}

export function MainBreadcrumbsInLayout({
    authenticated,
    instructor,
    administrator,
    enrolledCoursesNavItems = [],
}: MainBreadcrumbsInLayoutProps) {
    const breadcrumbs = useMainBreadcrumbs((s) => s.breadcrumbs)
    const pathname = usePathname()
    const navLinks = getSiteNavLinks({ authenticated, instructor, administrator })
    const mainMenuLinks = orderMainNavMenuLinks(navLinks)

    /** First crumb encodes main-menu section — shown only on the opener, not duplicated in the trail. */
    const menuAnchor = breadcrumbs[0]
    const trail = breadcrumbs.length > 0 ? breadcrumbs.slice(1) : []
    const isSingleBreadcrumb = trail.length === 0

    function linkIsCurrentMainSection(linkHref: string): boolean {
        if (menuAnchor) return pathsHrefEqual(menuAnchor.url, linkHref)
        const link = linkHref === homeLink.href ? homeLink : navLinks.find((l) => l.href === linkHref)
        return link?.match(pathname) ?? false
    }

    return (
        <Breadcrumb className="min-w-0 font-bold tracking-tight">
            <BreadcrumbList className={cn('gap-2 text-foreground sm:gap-2', isSingleBreadcrumb && 'text-lg')}>
                <BreadcrumbItem className="min-w-0 max-w-48 sm:max-w-xs">
                    <div className="flex max-w-full min-w-0 items-center gap-1">
                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger
                                            type="button"
                                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                            aria-haspopup="menu"
                                            aria-label={
                                                menuAnchor
                                                    ? `Open main navigation (current section: ${menuAnchor.title})`
                                                    : 'Open main navigation'
                                            }
                                        >
                                            <MenuIcon className="size-4 shrink-0" aria-hidden />
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Main navigation</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent
                                align="start"
                                className="min-w-52 -translate-y-2 translate-x-4 overflow-visible shadow-lg **:data-[slot=dropdown-menu-item]:py-1.5 **:data-[slot=dropdown-menu-item]:text-base **:data-[slot=dropdown-menu-sub-trigger]:py-1.5 **:data-[slot=dropdown-menu-sub-trigger]:text-base"
                            >
                                {mainMenuLinks.map(({ href, label }) => (
                                    <Fragment key={href}>
                                        {href === '/documentation' ? <DropdownMenuSeparator /> : null}
                                        {href === '/instructor' ? <DropdownMenuSeparator /> : null}
                                        {href === '/instructor' ? (
                                            <MainNavRoleSubmenu
                                                href={href}
                                                label={label}
                                                indexHref="/instructor"
                                                items={instructorIndexItems}
                                                pathname={pathname}
                                                isCurrentSection={linkIsCurrentMainSection(href)}
                                                subItemIcon={MainNavInstructorSubItemIcon}
                                            />
                                        ) : href === '/administrator' ? (
                                            <MainNavRoleSubmenu
                                                href={href}
                                                label={label}
                                                indexHref="/administrator"
                                                items={administratorIndexItems}
                                                pathname={pathname}
                                                isCurrentSection={linkIsCurrentMainSection(href)}
                                                subItemIcon={MainNavAdministratorSubItemIcon}
                                            />
                                        ) : href === '/courses' && authenticated ? (
                                            <MainNavRoleSubmenu
                                                href={href}
                                                label={label}
                                                indexHref="/courses"
                                                items={enrolledCoursesNavItems}
                                                pathname={pathname}
                                                isCurrentSection={linkIsCurrentMainSection(href)}
                                                subItemIcon={MainNavCoursesSubItemIcon}
                                            />
                                        ) : href === '/documentation' ? (
                                            <MainNavRoleSubmenu
                                                href={href}
                                                label={label}
                                                indexHref="/documentation"
                                                items={documentationSubmenuItems}
                                                pathname={pathname}
                                                isCurrentSection={linkIsCurrentMainSection(href)}
                                                subItemIcon={MainNavDocumentationSubItemIcon}
                                            />
                                        ) : href === '/about' ? (
                                            <MainNavRoleSubmenu
                                                href={href}
                                                label={label}
                                                indexHref="/about"
                                                items={aboutSubmenuItems}
                                                pathname={pathname}
                                                isCurrentSection={linkIsCurrentMainSection(href)}
                                                subItemIcon={MainNavAboutSubItemIcon}
                                            />
                                        ) : (
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={href}
                                                    className={cn(
                                                        linkIsCurrentMainSection(href) &&
                                                            'font-semibold text-foreground',
                                                    )}
                                                >
                                                    <MainNavMenuItemIcon href={href} />
                                                    {label}
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                    </Fragment>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {menuAnchor ? (
                            <BreadcrumbLink asChild>
                                <Link
                                    href={menuAnchor.url}
                                    className="min-w-0 flex-1 truncate font-bold text-foreground transition-colors hover:text-primary hover:underline hover:underline-offset-4"
                                >
                                    {menuAnchor.title}
                                </Link>
                            </BreadcrumbLink>
                        ) : (
                            <span className="min-w-0 flex-1 truncate font-bold text-foreground">Navigate</span>
                        )}
                    </div>
                </BreadcrumbItem>

                {trail.map((segment, index) => {
                    const isLast = index === trail.length - 1

                    return (
                        <Fragment key={`${segment.url}::${index}`}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="min-w-0 max-w-40 sm:max-w-md">
                                {isLast ? (
                                    <BreadcrumbPage className="truncate font-bold">{segment.title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={segment.url}
                                            className="truncate font-bold text-foreground hover:text-primary hover:underline hover:underline-offset-4"
                                        >
                                            {segment.title}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
