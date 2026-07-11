import jutge from '@/lib/jutge'
import { offerDownloadFile } from '@/lib/instructor/utils'

export async function downloadProblemPdf(problemId: string) {
    const download = await jutge.problems.getPdfStatement(problemId)
    offerDownloadFile(download)
}

export async function downloadProblemZip(problemId: string) {
    const download = await jutge.problems.getZipStatement(problemId)
    offerDownloadFile(download)
}

export async function downloadProblemTemplate(problemId: string, template: string) {
    const templates = await jutge.problems.getTemplates(problemId)
    if (!templates.includes(template)) {
        throw new Error('Template not found')
    }
    const download = await jutge.problems.getTemplate({ problem_id: problemId, template })
    offerDownloadFile(download, template)
}

export async function fetchProblemPdfBlobUrl(problemId: string): Promise<string> {
    const download = await jutge.problems.getPdfStatement(problemId)
    const blob = new Blob([new Uint8Array(download.data)], { type: download.type || 'application/pdf' })
    return URL.createObjectURL(blob)
}

export async function downloadProblemSolution(problemId: string, proglang: string) {
    const download = await jutge.instructor.problems.getSolutionAsFile({ problem_id: problemId, proglang })
    offerDownloadFile(download)
}
