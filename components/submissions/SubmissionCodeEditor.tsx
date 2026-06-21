'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { monacoLanguageForExtension } from '@/lib/highlightCode'
import { registerCustomMonacoLanguages } from '@/lib/monaco/registerCustomLanguages'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => null,
})

type SubmissionCodeEditorProps = {
    code: string
    codeExtension: string | null
}

export function SubmissionCodeEditor({ code, codeExtension }: SubmissionCodeEditorProps) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const language = monacoLanguageForExtension(codeExtension)
    const theme = mounted && resolvedTheme === 'dark' ? 'vs-dark' : 'vs'

    return (
        <MonacoEditor
            height="100%"
            beforeMount={registerCustomMonacoLanguages}
            defaultLanguage={language}
            defaultValue={code}
            theme={theme}
            options={{
                automaticLayout: true,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: 14,
                lineNumbers: 'on',
                minimap: { enabled: false },
                readOnly: false,
                scrollBeyondLastLine: false,
                tabSize: 4,
                wordWrap: 'off',
            }}
        />
    )
}
