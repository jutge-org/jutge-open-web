import { FileBoxIcon, FileCodeIcon, LockIcon, UnlockIcon } from 'lucide-react'
import { LucideIcon, ProblemRow } from './types'

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
        <span title={title}>
            <Icon size={14} className={state ? '' : 'opacity-25'} />
        </span>
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

export const SharingCell = ({ problem }: { problem: ProblemRow }) => (
    <div className="flex flex-row gap-2">
        <ProblemState state={!Boolean(problem.passcode)} info={lockInfo} />
        <ProblemState state={problem.shared_testcases} info={sharedTestcasesInfo} />
        <ProblemState state={problem.shared_solutions} info={sharedSolutionsInfo} />
    </div>
)
