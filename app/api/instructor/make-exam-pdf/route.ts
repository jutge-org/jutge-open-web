import { exec } from 'child_process'
import { readFile, writeFile } from 'fs/promises'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'
import util from 'util'
import { z } from 'zod'

import { getClientFromRequestCookies } from '@/lib/server-request-auth'

const execAsync = util.promisify(exec)

const zMakeExamPdfData = z.object({
    exam_nm: z.string(),
    extra: z.string(),
})

export async function POST(request: Request) {
    const client = getClientFromRequestCookies(request)
    if (!client) {
        return new NextResponse(null, { status: 401 })
    }

    try {
        const profile = await client.student.profile.get()
        if (!profile.instructor) {
            return new NextResponse(null, { status: 403 })
        }
    } catch {
        return new NextResponse(null, { status: 401 })
    }

    try {
        const data = zMakeExamPdfData.parse(await request.json())
        const jutge = client

        const exam = await jutge.instructor.exams.get(data.exam_nm)
        if (!exam) throw new Error(`Exam ${data.exam_nm} not found`)

        const tmp = `/tmp/open-jutge/${nanoid()}`
        await execAsync(`mkdir -p ${tmp}`)
        const pdfs: string[] = []

        for (const examProblem of exam.problems) {
            const abstractProblem = await jutge.problems.getAbstractProblem(examProblem.problem_nm)
            for (const problem_id in abstractProblem.problems) {
                pdfs.push(problem_id)
                const download = await jutge.problems.getPdfStatement(problem_id)
                const path = `${tmp}/${problem_id}.pdf`
                await writeFile(path, download.data)
            }
        }

        let mdProblems = ''
        for (const examProblem of exam.problems) {
            mdProblems += `* **${examProblem.caption}:**\n`
            const abstractProblem = await jutge.problems.getAbstractProblem(examProblem.problem_nm)
            for (const problem_id in abstractProblem.problems) {
                mdProblems += `  - [\`${problem_id}\`](https://jutge.org/problems/${problem_id}): ${abstractProblem.problems[problem_id].title}\n`
            }
            mdProblems += `\n\n`
        }

        const markdown = `---
mainfont: "Helvetica"
fontsize: 12pt
colorlinks: true
geometry: a4paper
---

## ${exam.course?.title}

# ${exam.title}

${exam.description}

${mdProblems}

---

${data.extra}

    `

        await writeFile(`${tmp}/cover.md`, markdown)
        await execAsync(`pandoc --variable mainfont="Palatino" ${tmp}/cover.md -o ${tmp}/cover.pdf`)
        pdfs.unshift('cover')

        await execAsync(
            `gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=${tmp}/exam.pdf ${pdfs.map((pdf) => `${tmp}/${pdf}.pdf`).join(' ')}`,
        )

        const buffer = await readFile(`${tmp}/exam.pdf`)

        await execAsync(`rm -rf ${tmp}`)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${data.exam_nm}.pdf"`,
            },
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to generate exam PDF'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
