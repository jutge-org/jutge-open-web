import type { languages } from 'monaco-editor'

export function definition(): languages.IMonarchLanguage {
    return {
        defaultToken: '',
        ignoreCase: true,
        tokenPostfix: '.basic',

        keywords: [
            'and',
            'as',
            'byref',
            'byte',
            'call',
            'case',
            'cbyte',
            'cdbl',
            'cint',
            'clng',
            'const',
            'continue',
            'csng',
            'cstr',
            'cuint',
            'culng',
            'cushort',
            'declare',
            'dim',
            'do',
            'double',
            'else',
            'elseif',
            'end',
            'enum',
            'exit',
            'for',
            'function',
            'goto',
            'if',
            'integer',
            'long',
            'loop',
            'mod',
            'next',
            'not',
            'or',
            'print',
            'private',
            'public',
            'redim',
            'return',
            'select',
            'shared',
            'shl',
            'short',
            'shr',
            'single',
            'static',
            'step',
            'string',
            'sub',
            'then',
            'to',
            'type',
            'ubyte',
            'uinteger',
            'ulong',
            'union',
            'until',
            'ushort',
            'wend',
            'while',
            'xor',
        ],

        typeKeywords: ['boolean', 'integer', 'long', 'single', 'double', 'string', 'variant', 'object'],

        operators: ['=', '<', '>', '<=', '>=', '<>', '+', '-', '*', '/', '\\', '^', '&'],

        symbols: /[=><!~?:&|+\-*\/\^%]+/,

        tokenizer: {
            root: [
                { include: '@whitespace' },
                [/[{}()\[\]]/, '@brackets'],
                [
                    /[a-zA-Z_]\w*/,
                    { cases: { '@typeKeywords': 'type', '@keywords': 'keyword', '@default': 'identifier' } },
                ],
                [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
                [/\$[0-9A-Fa-f]+/, 'number.hex'],
                [/\d+/, 'number'],
                [/[;,.]/, 'delimiter'],
                [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, 'string', '@string'],
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/'.*$/, 'comment'],
                [/\brem\b.*$/i, 'comment'],
            ],

            string: [
                [/[^\\"]+/, 'string'],
                [/\\./, 'string.escape'],
                [/"/, 'string', '@pop'],
            ],
        },
    }
}

export function configuration(): languages.LanguageConfiguration {
    return {
        comments: {
            lineComment: "'",
        },
        brackets: [
            ['(', ')'],
            ['[', ']'],
        ],
    }
}
