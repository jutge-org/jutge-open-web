'use client'

import { useState } from 'react'

import { ProblemTestcaseAccordionItem } from '@/components/problems/ProblemTestcaseAccordionItem'
import { ProblemWidgetCard } from '@/components/problems/ProblemWidgetCard'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import type { DecodedTestcase } from '@/lib/data/problemDetail'

type ProblemTestcasesProps =
    | {
          loading: true
          testcases?: never
      }
    | {
          loading?: false
          testcases: DecodedTestcase[]
      }

export function ProblemTestcases(props: ProblemTestcasesProps) {
    if (props.loading) {
        return <ProblemWidgetCard title="Test cases" />
    }

    const { testcases } = props
    const [openItems, setOpenItems] = useState<string[]>([])

    function toggleTestcase(name: string) {
        setOpenItems((current) =>
            current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
        )
    }

    if (testcases.length === 0) {
        return (
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader>
                    <CardDescription>This problem has no test cases.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <Card className="ring-0 border border-border shadow-sm">
                <CardHeader>
                    <CardDescription className="text-center">
                        Test cases include private cases used for judging. Please do not distribute them.
                    </CardDescription>
                </CardHeader>
            </Card>
            {testcases.map((testcase) => (
                <ProblemTestcaseAccordionItem
                    key={testcase.name}
                    testcase={testcase}
                    isOpen={openItems.includes(testcase.name)}
                    onToggle={() => toggleTestcase(testcase.name)}
                />
            ))}
        </div>
    )
}
