'use client'

import { useState } from 'react'

import { ProblemSolutionAccordionItem } from '@/components/problems/ProblemSolutionAccordionItem'
import { ProblemWidgetCard } from '@/components/problems/ProblemWidgetCard'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'

type ProblemSolutionsProps =
    | {
          loading: true
          pageKey?: string
          problemId?: string
          problem_nm?: string
          proglangs?: never
      }
    | {
          loading?: false
          pageKey: string
          problemId: string
          problem_nm: string
          proglangs: string[]
      }

export function ProblemSolutions(props: ProblemSolutionsProps) {
    if (props.loading) {
        return <ProblemWidgetCard title="Solutions" />
    }

    const { pageKey, problemId, problem_nm, proglangs } = props
    const [openItems, setOpenItems] = useState<string[]>([])

    function toggleProglang(proglang: string) {
        setOpenItems((current) =>
            current.includes(proglang) ? current.filter((item) => item !== proglang) : [...current, proglang],
        )
    }

    if (proglangs.length === 0) {
        return (
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader>
                    <CardDescription>This problem has no official solutions.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader>
                    <CardDescription className="text-center">
                        Solutions might not have been written for students. Please do not distribute solutions.
                    </CardDescription>
                </CardHeader>
            </Card>
            {proglangs.map((proglang) => (
                <ProblemSolutionAccordionItem
                    key={proglang}
                    pageKey={pageKey}
                    problemId={problemId}
                    problem_nm={problem_nm}
                    proglang={proglang}
                    isOpen={openItems.includes(proglang)}
                    onToggle={() => toggleProglang(proglang)}
                />
            ))}
        </div>
    )
}
