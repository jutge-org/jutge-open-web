import type { JutgeApiClient } from '@/lib/jutge_api_client'

export async function enrollInCourse(client: JutgeApiClient, courseKey: string): Promise<void> {
    await client.student.courses.enroll(courseKey)
}

export async function unenrollFromCourse(client: JutgeApiClient, courseKey: string): Promise<void> {
    await client.student.courses.unenroll(courseKey)
}

export async function archiveCourse(client: JutgeApiClient, courseKey: string): Promise<void> {
    await client.student.courses.archive(courseKey)
}

export async function unarchiveCourse(client: JutgeApiClient, courseKey: string): Promise<void> {
    await client.student.courses.unArchive(courseKey)
}
