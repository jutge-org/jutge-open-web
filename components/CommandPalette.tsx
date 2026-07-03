'use client'

import {
    fetchCommandPaletteCourses,
    fetchCommandPaletteExams,
    fetchCommandPaletteProblems,
    type CommandPaletteCourse,
} from '@/actions/commandPalette'
import { CommandSearchInput } from '@/components/CommandSearchInput'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    commandPaletteSections,
    filterCommandPaletteSections,
    getCommandPaletteAppSections,
    type CommandPaletteSection,
} from '@/lib/commandPaletteSections'
import { courseHref, filterAndSortCourses, publicCourseHref } from '@/lib/courses'
import { filterAndSortExams, type ExamRow } from '@/lib/exams'
import { filterProblems } from '@/lib/problems'
import type { SiteNavLinksContext } from '@/lib/siteNavLinks'
import type { ProblemRow } from '@/services/queries/problems'
import {
    BookOpenIcon,
    BookTextIcon,
    FileBracesCornerIcon,
    InfoIcon,
    LayoutGridIcon,
    SchoolIcon,
    TerminalIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

const RESULTS_LIMIT = 10

function SearchShortcutHint() {
    const [modifierKey, setModifierKey] = useState('Ctrl')

    useEffect(() => {
        const isApplePlatform =
            typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
        setModifierKey(isApplePlatform ? '⌘' : 'Ctrl')
    }, [])

    return (
        <KbdGroup className="ml-2">
            <Kbd>{modifierKey} K</Kbd>
        </KbdGroup>
    )
}

type CommandPaletteProps = SiteNavLinksContext

export function CommandPalette({ authenticated, instructor = false, administrator = false }: CommandPaletteProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [problems, setProblems] = useState<ProblemRow[]>([])
    const [courses, setCourses] = useState<CommandPaletteCourse[]>([])
    const [exams, setExams] = useState<ExamRow[]>([])
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const navContext = useMemo(
        () => ({ authenticated, instructor, administrator }),
        [authenticated, instructor, administrator],
    )

    const loadData = useCallback(async () => {
        if (loaded) {
            return
        }

        setLoading(true)
        try {
            const [problemsData, coursesData, examsData] = await Promise.all([
                fetchCommandPaletteProblems(),
                fetchCommandPaletteCourses(),
                authenticated ? fetchCommandPaletteExams() : Promise.resolve([]),
            ])
            setProblems(problemsData)
            setCourses(coursesData)
            setExams(examsData)
            setLoaded(true)
        } finally {
            setLoading(false)
        }
    }, [authenticated, loaded])

    useEffect(() => {
        if (open) {
            void loadData()
            return
        }
        setQuery('')
    }, [open, loadData])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                setOpen((current) => !current)
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [])

    const trimmedQuery = query.trim()

    const filteredProblems = useMemo(() => {
        if (!trimmedQuery) {
            return []
        }
        return filterProblems(problems, trimmedQuery).slice(0, RESULTS_LIMIT)
    }, [problems, trimmedQuery])

    const filteredCourses = useMemo(() => {
        if (!trimmedQuery) {
            return []
        }
        return filterAndSortCourses(courses, trimmedQuery, 'all', 'title').slice(0, RESULTS_LIMIT)
    }, [courses, trimmedQuery])

    const filteredExams = useMemo(() => {
        if (!trimmedQuery || !authenticated) {
            return []
        }
        return filterAndSortExams(exams, trimmedQuery, 'all', 'all', 'title').slice(0, RESULTS_LIMIT)
    }, [authenticated, exams, trimmedQuery])

    const filteredSections = useMemo(() => {
        if (!trimmedQuery) {
            return { app: [], documentation: [], about: [] }
        }

        const appSections = filterCommandPaletteSections(getCommandPaletteAppSections(navContext), trimmedQuery).slice(
            0,
            RESULTS_LIMIT,
        )
        const staticSections = filterCommandPaletteSections(commandPaletteSections, trimmedQuery)

        return {
            app: appSections,
            documentation: staticSections.filter((section) => section.area === 'documentation').slice(0, RESULTS_LIMIT),
            about: staticSections.filter((section) => section.area === 'about').slice(0, RESULTS_LIMIT),
        }
    }, [navContext, trimmedQuery])

    const hasResults =
        filteredProblems.length > 0 ||
        filteredCourses.length > 0 ||
        filteredExams.length > 0 ||
        filteredSections.app.length > 0 ||
        filteredSections.documentation.length > 0 ||
        filteredSections.about.length > 0

    function navigate(href: string) {
        setOpen(false)
        router.push(href)
    }

    function navigateToSection(section: CommandPaletteSection) {
        setOpen(false)
        if (section.external) {
            window.open(section.href, '_blank', 'noopener,noreferrer')
            return
        }
        router.push(section.href)
    }

    const searchHint = authenticated
        ? 'Type to search problems, courses, exams, sections, and documentation.'
        : 'Type to search problems, courses, sections, and documentation.'

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Quick search"
                            onClick={() => setOpen(true)}
                        >
                            <TerminalIcon className="size-4.5" aria-hidden />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Quick search
                        <SearchShortcutHint />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                title="Quick search"
                description="Search problems, courses, exams, sections, and documentation"
                className="max-w-2xl p-4"
            >
                <Command shouldFilter={false}>
                    <div className="px-2 pb-2 text-sm font-medium flex flex-row items-center gap-2">
                        <TerminalIcon className="size-4.5" aria-hidden />
                        Quick search
                        <div className="flex-1"></div>
                        <SearchShortcutHint />
                    </div>
                    <CommandSearchInput placeholder="Search..." value={query} onValueChange={setQuery} autoFocus />
                    <CommandList className="max-h-96">
                        {loading ? <CommandEmpty>Loading…</CommandEmpty> : null}
                        {!loading && !trimmedQuery ? (
                            <CommandEmpty className="text-muted-foreground">{searchHint}</CommandEmpty>
                        ) : null}
                        {!loading && trimmedQuery && !hasResults ? (
                            <CommandEmpty>No results found.</CommandEmpty>
                        ) : null}
                        {!loading && filteredProblems.length > 0 ? (
                            <CommandGroup heading="Problems">
                                {filteredProblems.map((problem) => (
                                    <CommandItem
                                        key={problem.problem_nm}
                                        value={problem.problem_nm}
                                        onSelect={() => navigate(`/problems/${problem.problem_nm}`)}
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <FileBracesCornerIcon className="size-3.5 shrink-0" aria-hidden />
                                                <span className="truncate font-medium">{problem.title}</span>
                                            </div>
                                            <span className="truncate pl-5.5 text-xs text-muted-foreground">
                                                {problem.problem_nm}
                                                {problem.author ? ` · ${problem.author}` : ''}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : null}
                        {!loading && filteredProblems.length > 0 && filteredCourses.length > 0 ? (
                            <CommandSeparator />
                        ) : null}
                        {!loading && filteredCourses.length > 0 ? (
                            <CommandGroup heading="Courses">
                                {filteredCourses.map((course) => (
                                    <CommandItem
                                        key={course.course_key}
                                        value={course.course_key}
                                        onSelect={() =>
                                            navigate(
                                                authenticated
                                                    ? courseHref(course.course_key)
                                                    : publicCourseHref(course.course_key),
                                            )
                                        }
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <BookOpenIcon className="size-3.5 shrink-0" aria-hidden />
                                                <span className="truncate font-medium">{course.title}</span>
                                            </div>
                                            <span className="truncate pl-5.5 text-xs text-muted-foreground">
                                                {course.ownerName}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : null}
                        {!loading &&
                        (filteredProblems.length > 0 || filteredCourses.length > 0) &&
                        filteredExams.length > 0 ? (
                            <CommandSeparator />
                        ) : null}
                        {!loading && filteredExams.length > 0 ? (
                            <CommandGroup heading="Exams">
                                {filteredExams.map((exam) => (
                                    <CommandItem
                                        key={exam.exam_nm}
                                        value={exam.exam_nm}
                                        onSelect={() => navigate(`/exams/${exam.exam_nm}`)}
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <SchoolIcon className="size-3.5 shrink-0" aria-hidden />
                                                <span className="truncate font-medium">{exam.title}</span>
                                            </div>
                                            <span className="truncate pl-5.5 text-xs text-muted-foreground">
                                                {exam.courseTitle} · {exam.ownerName}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : null}
                        {!loading &&
                        (filteredProblems.length > 0 || filteredCourses.length > 0 || filteredExams.length > 0) &&
                        filteredSections.app.length > 0 ? (
                            <CommandSeparator />
                        ) : null}
                        {!loading && filteredSections.app.length > 0 ? (
                            <CommandGroup heading="Sections">
                                {filteredSections.app.map((section) => (
                                    <CommandItem
                                        key={section.href}
                                        value={section.href}
                                        onSelect={() => navigateToSection(section)}
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <LayoutGridIcon className="size-3.5 shrink-0" aria-hidden />
                                                <span className="truncate font-medium">{section.label}</span>
                                            </div>
                                            <span className="truncate pl-5.5 text-xs text-muted-foreground">
                                                {section.description}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : null}
                        {!loading &&
                        (filteredProblems.length > 0 ||
                            filteredCourses.length > 0 ||
                            filteredExams.length > 0 ||
                            filteredSections.app.length > 0) &&
                        filteredSections.documentation.length > 0 ? (
                            <CommandSeparator />
                        ) : null}
                        {!loading && filteredSections.documentation.length > 0 ? (
                            <CommandGroup heading="Documentation">
                                {filteredSections.documentation.map((section) => (
                                    <CommandItem
                                        key={section.href}
                                        value={section.href}
                                        onSelect={() => navigateToSection(section)}
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <BookTextIcon className="size-3.5 shrink-0" aria-hidden />
                                                <span className="truncate font-medium">{section.label}</span>
                                            </div>
                                            <span className="truncate pl-5.5 text-xs text-muted-foreground">
                                                {section.description}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : null}
                        {!loading &&
                        (filteredProblems.length > 0 ||
                            filteredCourses.length > 0 ||
                            filteredExams.length > 0 ||
                            filteredSections.app.length > 0 ||
                            filteredSections.documentation.length > 0) &&
                        filteredSections.about.length > 0 ? (
                            <CommandSeparator />
                        ) : null}
                        {!loading && filteredSections.about.length > 0 ? (
                            <CommandGroup heading="About">
                                {filteredSections.about.map((section) => (
                                    <CommandItem
                                        key={section.href}
                                        value={section.href}
                                        onSelect={() => navigateToSection(section)}
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <InfoIcon className="size-3.5 shrink-0" aria-hidden />
                                                <span className="truncate font-medium">{section.label}</span>
                                            </div>
                                            <span className="truncate pl-5.5 text-xs text-muted-foreground">
                                                {section.description}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : null}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
}
