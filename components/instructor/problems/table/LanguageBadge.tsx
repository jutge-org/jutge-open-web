import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { BotIcon, BotMessageSquareIcon } from 'lucide-react'
import { ProblemRow } from './types'

export const LanguageBadge = ({ language, problem }: { language: string; problem: ProblemRow }) => {
    const abstractProblem = problem.abstractProblems[problem.problem_nm]
    if (!abstractProblem) {
        return (
            <Badge variant="secondary" className="mr-1 px-2">
                {language}
            </Badge>
        )
    }
    const { problem_nm } = problem
    const { solution_tags, problems } = abstractProblem
    const { summary } = problems[`${problem_nm}_${language}`]
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant="secondary" className="mr-1 px-2">
                        {language} <BotMessageSquareIcon size={12} className="ml-1" />
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="flex w-64 flex-col gap-2 items-start">
                    <p className="font-semibold">{summary?.summary_1s}</p>
                    <p>{summary?.summary_1p}</p>
                    <p>{summary?.keywords.replaceAll(',', ', ')}</p>
                    <p className="flex gap-1">
                        <BotIcon size={14} className="" /> {summary?.model}
                    </p>
                    <hr />
                    <p>{solution_tags?.tags.replaceAll(',', ', ')}</p>
                    <p className="flex gap-1 justify-start">
                        <BotIcon size={14} className="" /> {solution_tags?.model}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
