import { AlertCircleIcon, BugIcon, CatIcon, SkullIcon } from 'lucide-react'
import { LucideIcon, ProblemRow } from './types'

const AlertIcon = ({ title, Icon }: { title: string; Icon: LucideIcon }) => (
    <span title={title}>
        <Icon size={14} className="text-red-800" />
    </span>
)

export const AlertsCell = ({ problem }: { problem: ProblemRow }) => (
    <div className="mt-3 flex flex-row items-center gap-2">
        {problem.deprecated && <AlertIcon title="Deprecated" Icon={SkullIcon} />}
        {!problem.checked && <AlertIcon title="Checks failed" Icon={AlertCircleIcon} />}
        {problem.se_count > 0 && <AlertIcon title={`${problem.se_count} setter errors`} Icon={CatIcon} />}
        {problem.ie_count > 0 && <AlertIcon title={`${problem.ie_count} internal errors`} Icon={BugIcon} />}
    </div>
)
