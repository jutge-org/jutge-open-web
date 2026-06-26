export const ACCEPTED_PROBLEMS_BUCKET_SIZE_MIN = 1
export const ACCEPTED_PROBLEMS_BUCKET_SIZE_MAX = 25
export const ACCEPTED_PROBLEMS_BUCKET_SIZE_DEFAULT = 10

export type AcceptedProblemsStudentsBucket = {
    label: string
    min: number
    students: number
}

function formatBucketLabel(min: number, bucketSize: number): string {
    if (bucketSize === 1) return String(min)
    const max = min + bucketSize - 1
    return `${min}–${max}`
}

export function deriveAcceptedProblemsStudentsHistogram(
    acceptedCounts: number[],
    bucketSize: number,
): AcceptedProblemsStudentsBucket[] {
    if (acceptedCounts.length === 0) return []

    const maxCount = Math.max(...acceptedCounts)
    const countsByBucketStart = new Map<number, number>()

    for (const count of acceptedCounts) {
        const bucketStart = Math.floor(count / bucketSize) * bucketSize
        countsByBucketStart.set(bucketStart, (countsByBucketStart.get(bucketStart) ?? 0) + 1)
    }

    const maxBucketStart = Math.floor(maxCount / bucketSize) * bucketSize
    const buckets: AcceptedProblemsStudentsBucket[] = []

    for (let start = 0; start <= maxBucketStart; start += bucketSize) {
        buckets.push({
            label: formatBucketLabel(start, bucketSize),
            min: start,
            students: countsByBucketStart.get(start) ?? 0,
        })
    }

    return buckets
}
