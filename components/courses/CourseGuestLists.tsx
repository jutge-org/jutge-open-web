import { listTitleFromKey } from '@/lib/courses'

type CourseGuestListsProps = {
    lists: string[]
    problemCount?: number
}

export function CourseGuestLists({ lists, problemCount }: CourseGuestListsProps) {
    if (problemCount === undefined && lists.length === 0) {
        return null
    }

    return (
        <>
            {problemCount !== undefined && problemCount > 0 ? (
                <>
                    <h2 className="mt-1.5 text-sm font-medium text-foreground">Number of problems</h2>
                    <p className="mt-1.5 ml-5.5 text-sm text-muted-foreground">
                        {problemCount} {problemCount === 1 ? 'problem' : 'problems'}
                    </p>
                </>
            ) : null}
            {lists.length > 0 ? (
                <>
                    <h2 className="-mt-2 text-sm font-medium text-foreground">Lists of problems</h2>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {lists.map((listKey) => (
                            <li key={listKey}>{listTitleFromKey(listKey)}</li>
                        ))}
                    </ul>
                </>
            ) : null}
        </>
    )
}
