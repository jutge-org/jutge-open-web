'use client'

import { useJutgeAuth } from '@/hooks/use-jutge-auth'

import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { JForm, type JFormFields } from '@/components/instructor/JForm'
import StatementDialog from '@/components/instructor/StatementDialog'
import { mapmap, offerDownloadFile } from '@/lib/instructor/utils'
import type { BriefAbstractProblem, Problem, ProblemSuppl } from '@/lib/jutge_api_client'
import { BotIcon, FileCodeIcon, FileTerminalIcon, FileTextIcon, FileTypeIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { all } from 'radash'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { type JSX, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type ProblemInfo = {
    abstractProblem: BriefAbstractProblem
    problem: Problem
    problemSuppl: ProblemSuppl
}

export function ProblemTranslationView() {
    const { client } = useJutgeAuth()

    const { problem_id, problem_nm } = useParams<{ problem_id: string; problem_nm: string }>()
    const [abstractProblem, setAbstractProblem] = useState<BriefAbstractProblem | null>(null)
    const [problem, setProblem] = useState<Problem | null>(null)
    const [problemSuppl, setProblemSuppl] = useState<ProblemSuppl | null>(null)

    useEffect(() => {
        async function fetchData() {
    const { client } = useJutgeAuth()

            const data = await all({
                abstractProblem: client.problems.getAbstractProblem(problem_nm),
                problem: client.problems.getProblem(problem_id),
                problemSuppl: client.problems.getProblemSuppl(problem_id),
            })
            setAbstractProblem(data.abstractProblem)
            setProblem(data.problem)
            setProblemSuppl(data.problemSuppl)
        }

        fetchData()
    }, [problem_id, problem_nm])

    if (abstractProblem === null || problem === null || problemSuppl === null)
        return <SimpleSpinner size={64} className="pt-24" />

    return (
        <EditProblemForm
            info={{
                abstractProblem,
                problem,
                problemSuppl,
            }}
        />
    )
}

interface ProblemFormProps {
    info: ProblemInfo
}

function EditProblemForm({ info }: ProblemFormProps) {
    const { client } = useJutgeAuth()

    const [statement, setStatement] = useState<JSX.Element | null>(null)
    const [isStatementDialogOpen, setIsStatementDialogOpen] = useState(false)

    const fields: JFormFields = {
        problem_id: {
            type: 'input',
            label: 'Id',
            value: info.problem.problem_id,
        },
        title: {
            type: 'input',
            label: 'Title',
            value: info.problem.title,
        },
        author: {
            type: 'input',
            label: 'Author',
            value: info.abstractProblem.author || '—',
        },
        author_email: {
            type: 'input',
            label: 'Author email',
            value: info.abstractProblem.author_email || '—',
        },
        translator: {
            type: 'input',
            label: 'Translator',
            value: info.problem.translator || '—',
        },
        translator_email: {
            type: 'input',
            label: 'Translator email',
            value: info.problem.translator_email || '—',
        },
        checks: {
            type: 'free',
            label: 'Checks',
            content: formatChecks(info.problemSuppl.official_solution_checks),
        },
        pdf: {
            type: 'free',
            label: 'Statement',
            content: (
                <div className="flex flex-row gap-2">
                    <Button
                        variant="outline"
                        className="mt-1 mb-1 h-16 w-16 [&_svg]:size-12"
                        title="PDF"
                        onClick={pdfAction}
                    >
                        <FileTextIcon strokeWidth={0.8} />
                    </Button>
                    <Button
                        variant="outline"
                        className="mt-1 mb-1 h-16 w-16 [&_svg]:size-12"
                        title="HTML"
                        onClick={htmlAction}
                    >
                        <FileCodeIcon strokeWidth={0.8} />
                    </Button>
                    <Button
                        variant="outline"
                        className="mt-1 mb-1 h-16 w-16 [&_svg]:size-12"
                        title="Markdown"
                        onClick={markdownAction}
                    >
                        <FileTerminalIcon strokeWidth={0.8} />
                    </Button>
                    <Button
                        variant="outline"
                        className="mt-1 mb-1 h-16 w-16 [&_svg]:size-12"
                        title="Text"
                        onClick={textAction}
                    >
                        <FileTypeIcon strokeWidth={0.8} />
                    </Button>
                </div>
            ),
        },

        summary_1s: {
            type: 'input',
            label: (
                <div
                    className="flex flex-row items-center justify-end gap-2"
                    title={`Summary in one sentence by ${info.problem.summary?.model}.`}
                >
                    Summary 1S <BotIcon size={16} className="-mt-1" />
                </div>
            ),
            value: info.problem.summary?.summary_1s || '—',
        },

        summary_1p: {
            type: 'textarea',
            label: (
                <div
                    className="flex flex-row items-center justify-end gap-2"
                    title={`Summary in one paragraph by ${info.problem.summary?.model}.`}
                >
                    Summary 1P <BotIcon size={16} className="-mt-1" />
                </div>
            ),
            value: info.problem.summary?.summary_1s || '—',
            setValue: () => {},
        },

        keywords: {
            type: 'input',
            label: (
                <div
                    className="flex flex-row items-center justify-end gap-2"
                    title={`Keywords by ${info.problem.summary?.model}.`}
                >
                    Keywords <BotIcon size={16} className="-mt-1" />
                </div>
            ),
            value: info.problem.summary?.keywords.replaceAll(',', ', ') || '—',
        },

        view: {
            type: 'free',
            label: 'View',
            content: (
                <div className="rounded-lg border p-2 text-sm">
                    <a href={`https://jutge.org/problems/${info.problem.problem_id}`} target="_blank">
                        {info.problem.problem_id}
                    </a>
                </div>
            ),
        },
    }

    if (!info.problem.translator) delete fields.translator
    if (!info.problem.translator_email) delete fields.translator_email
    if (!info.abstractProblem.author) delete fields.author
    if (!info.abstractProblem.author_email) delete fields.author_email

    async function pdfAction() {
    const { client } = useJutgeAuth()

        const download = await client.problems.getPdfStatement(info.problem.problem_id)
        offerDownloadFile(download)
    }

    async function htmlAction() {
    const { client } = useJutgeAuth()

        const htmlStatement = await client.problems.getHtmlStatement(info.problem.problem_id)
        setStatement(
            <div
                className="h-96 w-full overflow-y-auto rounded-lg border p-4"
                dangerouslySetInnerHTML={{ __html: htmlStatement }}
            />,
        )
        setIsStatementDialogOpen(true)
    }

    async function textAction() {
    const { client } = useJutgeAuth()

        const textStatement = await client.problems.getTextStatement(info.problem.problem_id)
        setStatement(<Textarea className="h-96 w-full text-sm" value={textStatement} readOnly />)
        setIsStatementDialogOpen(true)
    }

    async function markdownAction() {
    const { client } = useJutgeAuth()

        const markdownStatement = await client.problems.getMarkdownStatement(info.problem.problem_id)
        setStatement(
            <div className="prose prose-sm h-96 w-full overflow-y-auto rounded-lg border p-4 text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownStatement}</ReactMarkdown>
            </div>,
        )
        setIsStatementDialogOpen(true)
    }

    return (
        <>
            <JForm fields={fields} />
            <StatementDialog
                problem_id={info.problem.problem_id}
                content={statement}
                isOpen={isStatementDialogOpen}
                setIsOpen={setIsStatementDialogOpen}
            />
        </>
    )
}

function formatChecks(checks: Record<string, boolean>) {
    return (
        <div className="mt-1 flex flex-row gap-2">
            {mapmap(checks, (proglang, ok) => (
                <Badge key={proglang} className={`px-2 py-1 font-normal ${ok ? 'bg-green-800' : 'bg-red-800'}`}>
                    {proglang}
                </Badge>
            ))}
        </div>
    )
}
