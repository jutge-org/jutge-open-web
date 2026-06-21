import hljs from 'highlight.js/lib/core'
import ada from 'highlight.js/lib/languages/ada'
import bash from 'highlight.js/lib/languages/bash'
import basic from 'highlight.js/lib/languages/basic'
import c from 'highlight.js/lib/languages/c'
import clojure from 'highlight.js/lib/languages/clojure'
import cmake from 'highlight.js/lib/languages/cmake'
import cpp from 'highlight.js/lib/languages/cpp'
import crystal from 'highlight.js/lib/languages/crystal'
import csharp from 'highlight.js/lib/languages/csharp'
import d from 'highlight.js/lib/languages/d'
import delphi from 'highlight.js/lib/languages/delphi'
import elixir from 'highlight.js/lib/languages/elixir'
import erlang from 'highlight.js/lib/languages/erlang'
import fortran from 'highlight.js/lib/languages/fortran'
import go from 'highlight.js/lib/languages/go'
import haskell from 'highlight.js/lib/languages/haskell'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import julia from 'highlight.js/lib/languages/julia'
import kotlin from 'highlight.js/lib/languages/kotlin'
import lisp from 'highlight.js/lib/languages/lisp'
import lua from 'highlight.js/lib/languages/lua'
import makefile from 'highlight.js/lib/languages/makefile'
import nim from 'highlight.js/lib/languages/nim'
import objectivec from 'highlight.js/lib/languages/objectivec'
import perl from 'highlight.js/lib/languages/perl'
import php from 'highlight.js/lib/languages/php'
import prolog from 'highlight.js/lib/languages/prolog'
import python from 'highlight.js/lib/languages/python'
import r from 'highlight.js/lib/languages/r'
import ruby from 'highlight.js/lib/languages/ruby'
import rust from 'highlight.js/lib/languages/rust'
import scala from 'highlight.js/lib/languages/scala'
import scheme from 'highlight.js/lib/languages/scheme'
import swift from 'highlight.js/lib/languages/swift'
import vbnet from 'highlight.js/lib/languages/vbnet'
import verilog from 'highlight.js/lib/languages/verilog'

hljs.registerLanguage('ada', ada)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('basic', basic)
hljs.registerLanguage('c', c)
hljs.registerLanguage('clojure', clojure)
hljs.registerLanguage('cmake', cmake)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('crystal', crystal)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('d', d)
hljs.registerLanguage('delphi', delphi)
hljs.registerLanguage('elixir', elixir)
hljs.registerLanguage('erlang', erlang)
hljs.registerLanguage('fortran', fortran)
hljs.registerLanguage('go', go)
hljs.registerLanguage('haskell', haskell)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('julia', julia)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('lisp', lisp)
hljs.registerLanguage('lua', lua)
hljs.registerLanguage('makefile', makefile)
hljs.registerLanguage('nim', nim)
hljs.registerLanguage('objectivec', objectivec)
hljs.registerLanguage('perl', perl)
hljs.registerLanguage('php', php)
hljs.registerLanguage('prolog', prolog)
hljs.registerLanguage('python', python)
hljs.registerLanguage('r', r)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('scala', scala)
hljs.registerLanguage('scheme', scheme)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('vbnet', vbnet)
hljs.registerLanguage('verilog', verilog)

const EXTENSION_TO_HLJS: Record<string, string> = {
    ada: 'ada',
    adb: 'ada',
    ads: 'ada',
    bash: 'bash',
    bas: 'basic',
    c: 'c',
    cc: 'cpp',
    clj: 'clojure',
    cmake: 'cmake',
    cpp: 'cpp',
    cr: 'crystal',
    cs: 'csharp',
    cxx: 'cpp',
    d: 'd',
    erl: 'erlang',
    ex: 'elixir',
    exs: 'elixir',
    f: 'fortran',
    for: 'fortran',
    f90: 'fortran',
    go: 'go',
    h: 'cpp',
    hrl: 'erlang',
    hs: 'haskell',
    java: 'java',
    js: 'javascript',
    jl: 'julia',
    kt: 'kotlin',
    kts: 'kotlin',
    lisp: 'lisp',
    lsp: 'lisp',
    lua: 'lua',
    m: 'objectivec',
    make: 'makefile',
    mk: 'makefile',
    mm: 'objectivec',
    nim: 'nim',
    pas: 'delphi',
    pl: 'perl',
    pm: 'perl',
    php: 'php',
    pro: 'prolog',
    py: 'python',
    r: 'r',
    rb: 'ruby',
    rs: 'rust',
    scala: 'scala',
    scm: 'scheme',
    sh: 'bash',
    ss: 'scheme',
    sv: 'verilog',
    swift: 'swift',
    v: 'verilog',
    vb: 'vbnet',
    zig: 'cpp',
}

function escapeHtml(text: string): string {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function highlightLanguageForExtension(extension: string | null): string | undefined {
    if (!extension) {
        return undefined
    }

    return EXTENSION_TO_HLJS[extension.toLowerCase()]
}

const EXTENSION_TO_MONACO: Record<string, string> = {
    quiz: 'plaintext',
    zig: 'zig',
}

const HLJS_TO_MONACO: Record<string, string> = {
    bash: 'shell',
    delphi: 'pascal',
    lisp: 'scheme',
    makefile: 'makefile',
    objectivec: 'objective-c',
    vbnet: 'vb',
}

export function monacoLanguageForExtension(extension: string | null): string | undefined {
    if (!extension) {
        return undefined
    }

    const normalizedExtension = extension.toLowerCase()
    const directMonacoLanguage = EXTENSION_TO_MONACO[normalizedExtension]
    if (directMonacoLanguage) {
        return directMonacoLanguage
    }

    const language = highlightLanguageForExtension(extension)
    if (!language) {
        return undefined
    }

    return HLJS_TO_MONACO[language] ?? language
}

export function highlightSubmissionCode(code: string, extension: string | null): string {
    const language = highlightLanguageForExtension(extension)

    if (language && hljs.getLanguage(language)) {
        try {
            return hljs.highlight(code, { language }).value
        } catch {
            // Fall back to auto-detection or plain text.
        }
    }

    try {
        const result = hljs.highlightAuto(code)
        if (result.relevance > 0) {
            return result.value
        }
    } catch {
        // Fall back to plain text.
    }

    return escapeHtml(code)
}
