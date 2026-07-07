'use server'

import { getCurrentClient } from '@/lib/auth'
import { isCourseOwnedByUser } from '@/lib/courses'
import { archiveCourse, enrollInCourse, unarchiveCourse, unenrollFromCourse } from '@/services/mutations/courses'
import { fetchCourse } from '@/services/queries/courses'

type CourseActionResult = { ok: true } | { ok: false; error: string }

export async function enrollCourseAction(courseKey: string): Promise<CourseActionResult> {
    const trimmed = courseKey.trim()
    if (!trimmed) {
        return { ok: false, error: 'Course key is required.' }
    }

    try {
        const client = await getCurrentClient()
        await enrollInCourse(client, trimmed)
        return { ok: true }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to enroll in course.'
        return { ok: false, error: message }
    }
}

export async function unenrollCourseAction(courseKey: string): Promise<CourseActionResult> {
    const trimmed = courseKey.trim()
    if (!trimmed) {
        return { ok: false, error: 'Course key is required.' }
    }

    try {
        const client = await getCurrentClient()
        const [result, profile] = await Promise.all([fetchCourse(client, trimmed), client.student.profile.get()])
        if (result && isCourseOwnedByUser(result.course.owner, profile)) {
            return { ok: false, error: 'You cannot unenroll from a course you own.' }
        }

        await unenrollFromCourse(client, trimmed)
        return { ok: true }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to unenroll from course.'
        return { ok: false, error: message }
    }
}

export async function archiveCourseAction(courseKey: string): Promise<CourseActionResult> {
    const trimmed = courseKey.trim()
    if (!trimmed) {
        return { ok: false, error: 'Course key is required.' }
    }

    try {
        const client = await getCurrentClient()
        await archiveCourse(client, trimmed)
        return { ok: true }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to archive course.'
        return { ok: false, error: message }
    }
}

export async function unarchiveCourseAction(courseKey: string): Promise<CourseActionResult> {
    const trimmed = courseKey.trim()
    if (!trimmed) {
        return { ok: false, error: 'Course key is required.' }
    }

    try {
        const client = await getCurrentClient()
        await unarchiveCourse(client, trimmed)
        return { ok: true }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to unarchive course.'
        return { ok: false, error: message }
    }
}
