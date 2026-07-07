export const MAKE_PRO2_COMPILER_ID = 'MakePRO2'

type TarEntry = {
    path: string
    isDirectory: boolean
    content: Buffer | null
}

type TreeNode = {
    name: string
    isDirectory: boolean
    children: TreeNode[]
}

function readTarString(header: Buffer, offset: number, length: number): string {
    return header
        .toString('utf-8', offset, offset + length)
        .replace(/\0.*$/, '')
        .trim()
}

function normalizeTarPath(path: string): string {
    return path.replace(/^\.\//, '').replace(/\/$/, '')
}

function parseTar(buffer: Buffer): TarEntry[] {
    const entries: TarEntry[] = []
    let offset = 0

    while (offset + 512 <= buffer.length) {
        const header = buffer.subarray(offset, offset + 512)
        offset += 512

        if (header.every((byte) => byte === 0)) {
            break
        }

        const name = readTarString(header, 0, 100)
        const prefix = readTarString(header, 345, 155)
        const rawPath = prefix ? `${prefix}/${name}` : name
        const path = normalizeTarPath(rawPath)
        if (!path) {
            continue
        }

        const size = Number.parseInt(readTarString(header, 124, 12), 8) || 0
        const typeflag = String.fromCharCode(header[156] ?? 0)
        const isDirectory = typeflag === '5' || (typeflag === '\0' && rawPath.endsWith('/'))

        const entry: TarEntry = {
            path,
            isDirectory,
            content: null,
        }

        if (!isDirectory && size > 0) {
            entry.content = buffer.subarray(offset, offset + size)
            offset += Math.ceil(size / 512) * 512
        }

        entries.push(entry)
    }

    return entries
}

function addPathToTree(root: TreeNode, path: string, isDirectory: boolean): void {
    const parts = path.split('/').filter(Boolean)
    let current = root

    for (let index = 0; index < parts.length; index += 1) {
        const part = parts[index]!
        const isLast = index === parts.length - 1
        let child = current.children.find((node) => node.name === part)

        if (!child) {
            child = {
                name: part,
                isDirectory: !isLast || isDirectory,
                children: [],
            }
            current.children.push(child)
        } else if (isLast && isDirectory) {
            child.isDirectory = true
        }

        current = child
    }
}

function sortTreeNodes(nodes: TreeNode[]): TreeNode[] {
    return [...nodes].sort((left, right) => {
        if (left.isDirectory !== right.isDirectory) {
            return left.isDirectory ? -1 : 1
        }

        return left.name.localeCompare(right.name)
    })
}

function renderTreeChildren(node: TreeNode, prefix: string): string[] {
    const lines: string[] = []
    const children = sortTreeNodes(node.children)

    children.forEach((child, index) => {
        const isLast = index === children.length - 1
        const branch = isLast ? '└── ' : '├── '
        const nextPrefix = prefix + (isLast ? '    ' : '│   ')

        lines.push(`${prefix}${branch}${child.name}${child.isDirectory ? '/' : ''}`)

        if (child.isDirectory && child.children.length > 0) {
            lines.push(...renderTreeChildren(child, nextPrefix))
        }
    })

    return lines
}

function renderTree(entries: TarEntry[]): string {
    const root: TreeNode = { name: '.', isDirectory: true, children: [] }

    for (const entry of entries) {
        addPathToTree(root, entry.path, entry.isDirectory)
    }

    return ['.', ...renderTreeChildren(root, '')].join('\n')
}

function decodeFileContent(content: Buffer): string {
    if (content.includes(0)) {
        return `// [binary file, ${content.length} bytes omitted]`
    }

    const text = content.toString('utf-8')
    if (text.includes('\uFFFD')) {
        return `// [binary file, ${content.length} bytes omitted]`
    }

    return text
}

export function makePro2TarToFakeCpp(tarBuffer: Buffer): string {
    const entries = parseTar(tarBuffer)
    const fileEntries = entries
        .filter((entry) => !entry.isDirectory && entry.content !== null)
        .sort((left, right) => left.path.localeCompare(right.path))

    const sections: string[] = [
        '/*',
        '────────────────────────────────────────────────────────────────────────────────────',
        'Reconstructed view of a MakePRO2 submission.',
        '────────────────────────────────────────────────────────────────────────────────────',
        '',
        'The original submission is stored as a tar archive containing C++ source',
        'files and folders. This file was generated for display: the directory tree',
        'is shown below, followed by each file prefixed with its relative path.',
        '',
        renderTree(entries),
        '',
        'Use the download button to download the original submission as a tar archive.',
        '────────────────────────────────────────────────────────────────────────────────────',
        '*/',
    ]

    for (const entry of fileEntries) {
        sections.push(
            '',
            `
/* 
────────────────────────────────────────────────────────────────────────────────────
${entry.path}
──────────────────────────────────────────────────────────────────────────────────── 
*/

`,
            decodeFileContent(entry.content!),
        )
    }

    return sections.join('\n')
}

export function decodeSubmissionCodeBase64(
    codeB64: string,
    compilerId: string,
    defaultExtension: string,
): { code: string; extension: string } {
    const buffer = Buffer.from(codeB64, 'base64')

    if (compilerId === MAKE_PRO2_COMPILER_ID) {
        return {
            code: makePro2TarToFakeCpp(buffer),
            extension: 'cpp',
        }
    }

    return {
        code: buffer.toString('utf-8'),
        extension: defaultExtension,
    }
}
