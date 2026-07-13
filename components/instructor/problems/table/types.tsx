import type { AbstractProblem } from '@/lib/jutge_api_client'
import { LucideProps } from 'lucide-react'

export type ProblemRow = {
    problem_nm: string
    title: string
    iconUrl: string | null
    created_at: string | number
    updated_at: string | number
    deprecated: boolean
    languages: string[]
    passcode: boolean
    shared_testcases: boolean
    shared_solutions: boolean
    abstractProblems: Record<string, AbstractProblem>
    checked: boolean
    se_count: number
    ie_count: number
}

export type LucideIcon = React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>
