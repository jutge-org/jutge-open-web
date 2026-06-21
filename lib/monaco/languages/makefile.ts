import type { languages } from 'monaco-editor'

export function definition(): languages.IMonarchLanguage {
    return {
        defaultToken: '',
        tokenPostfix: '.makefile',

        keywords: ['include', 'export', 'unexport', 'define', 'endef', 'ifeq', 'ifneq', 'ifdef', 'ifndef', 'else', 'endif'],

        tokenizer: {
            root: [
                [/^[\w.-]+(?=\s*:)/, 'type'],
                [/^\t/, 'keyword'],
                [/^[\w.-]+\s*:/, 'type'],
                [/#.*$/, 'comment'],
                [/\\$/, 'string.escape'],
                [/"([^"\\]|\\.)*"/, 'string'],
                [/'([^'\\]|\\.)*'/, 'string'],
                [/\$\([^)]*\)/, 'variable'],
                [/\$\{[^}]*\}/, 'variable'],
                [/\$\$\w+/, 'variable'],
                [/\$\w+/, 'variable'],
                [/[ \t\r\n]+/, 'white'],
            ],
        },
    }
}

export function configuration(): languages.LanguageConfiguration {
    return {
        comments: {
            lineComment: '#',
        },
    }
}
