import type { MainBreadcrumbSegment } from '@/store/MainBreadcrumbs'

const LOADING_TITLE = '…'
const SITE_TITLE = 'Jutge.org'

/**
 * Build a browser tab title from the page breadcrumb trail.
 * Format: `{page} — Jutge.org` or `{leaf} — {context} — Jutge.org`.
 */
export function documentTitleFromBreadcrumbs(breadcrumbs: readonly MainBreadcrumbSegment[]): string {
    const raw = breadcrumbs
        .map((segment) => segment.title.trim())
        .filter((title) => title.length > 0 && title !== SITE_TITLE)

    if (raw.length === 0) {
        return SITE_TITLE
    }

    // Problems / {nm} / {title} [/ …trail] — tab shows problem_nm, not the title
    if (raw[0] === 'Problems' && raw.length >= 2) {
        const problemNm = raw[1]
        if (problemNm === LOADING_TITLE) {
            return SITE_TITLE
        }

        const trail = raw.slice(3).filter((title) => title !== LOADING_TITLE)
        if (trail.length === 0) {
            return `${problemNm} — ${SITE_TITLE}`
        }

        return `${trail[trail.length - 1]} — ${problemNm} — ${SITE_TITLE}`
    }

    // Courses / {title} [/ …trail]
    if (raw[0] === 'Courses' && raw.length >= 2) {
        const courseTitle = raw[1]
        if (courseTitle === LOADING_TITLE) {
            return SITE_TITLE
        }

        const trail = raw.slice(2).filter((title) => title !== LOADING_TITLE)
        if (trail.length === 0) {
            return `${courseTitle} — ${SITE_TITLE}`
        }

        return `${trail[trail.length - 1]} — ${courseTitle} — ${SITE_TITLE}`
    }

    // Exams / {title} [/ …trail]
    if (raw[0] === 'Exams' && raw.length >= 2) {
        const examTitle = raw[1]
        if (examTitle === LOADING_TITLE) {
            return SITE_TITLE
        }

        const trail = raw.slice(2).filter((title) => title !== LOADING_TITLE)
        if (trail.length === 0) {
            return `${examTitle} — ${SITE_TITLE}`
        }

        return `${trail[trail.length - 1]} — ${examTitle} — ${SITE_TITLE}`
    }

    // Supervision / {course} / {student} [/ {nm} / {title} [/ …trail]] — tab shows problem_nm
    if (raw[0] === 'Supervision') {
        if (raw.length >= 4) {
            const problemNm = raw[3]
            if (problemNm === LOADING_TITLE) {
                return SITE_TITLE
            }

            const trail = raw.slice(5).filter((title) => title !== LOADING_TITLE)
            if (trail.length === 0) {
                return `${problemNm} — ${SITE_TITLE}`
            }

            return `${trail[trail.length - 1]} — ${problemNm} — ${SITE_TITLE}`
        }

        const titles = raw.filter((title) => title !== LOADING_TITLE)
        if (titles.length <= 1) {
            return `${titles[0] ?? 'Supervision'} — ${SITE_TITLE}`
        }

        return `${titles[titles.length - 1]} — ${titles[titles.length - 2]} — ${SITE_TITLE}`
    }

    const titles = raw.filter((title) => title !== LOADING_TITLE)
    if (titles.length === 0) {
        return SITE_TITLE
    }
    if (titles.length === 1) {
        return `${titles[0]} — ${SITE_TITLE}`
    }

    return `${titles[titles.length - 1]} — ${titles[titles.length - 2]} — ${SITE_TITLE}`
}

/** Ensure a free-form title ends with ` — Jutge.org`. */
export function withSiteDocumentTitle(title: string): string {
    const trimmed = title.trim()
    if (!trimmed || trimmed === SITE_TITLE) {
        return SITE_TITLE
    }
    if (trimmed.endsWith(` — ${SITE_TITLE}`) || trimmed.endsWith(`— ${SITE_TITLE}`)) {
        return trimmed
    }
    return `${trimmed} — ${SITE_TITLE}`
}
