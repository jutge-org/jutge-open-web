import { FileBoxIcon, FileCodeIcon, LockIcon, UnlockIcon } from 'lucide-react'
import { LucideIcon, ProblemRow } from './types'
import { cn } from '@/lib/utils'

type IconStateInfo = {
    Icon: LucideIcon
    title: string
}
type StateInfo = {
    positive: IconStateInfo
    negative: IconStateInfo
}

const ProblemState = ({ state, info }: { state: boolean; info: StateInfo }) => {
    const { Icon, title } = state ? info.positive : info.negative
    return (
        <div title={title}>
            <Icon size={10} className={cn('inline-block aspect-square w-3 h-3', state ? '' : 'opacity-25')} />
        </div>
    )
}

const lockInfo: StateInfo = {
    positive: { Icon: LockIcon, title: 'Protected by passcode' },
    negative: { Icon: UnlockIcon, title: 'Visible to all' },
}
const sharedTestcasesInfo: StateInfo = {
    positive: { Icon: FileBoxIcon, title: 'Test cases shared with instructors' },
    negative: { Icon: FileBoxIcon, title: 'Test cases not shared with instructors' },
}
const sharedSolutionsInfo: StateInfo = {
    positive: { Icon: FileCodeIcon, title: 'Solutions shared with instructors' },
    negative: { Icon: FileCodeIcon, title: 'Solutions not shared with instructors' },
}

export const SharingCell = ({ problem, className }: { problem: ProblemRow; className?: string }) => (
    <div className={cn('flex flex-row gap-1 items-center', className)}>
        <ProblemState state={!Boolean(problem.passcode)} info={lockInfo} />
        <ProblemState state={problem.shared_testcases} info={sharedTestcasesInfo} />
        <ProblemState state={problem.shared_solutions} info={sharedSolutionsInfo} />
    </div>
)
