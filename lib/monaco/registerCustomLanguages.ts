import type { Monaco } from '@monaco-editor/react'
import type { languages } from 'monaco-editor'

import * as ada from '@/lib/monaco/languages/ada'
import * as basic from '@/lib/monaco/languages/basic'
import * as crystal from '@/lib/monaco/languages/crystal'
import * as d from '@/lib/monaco/languages/d'
import * as erlang from '@/lib/monaco/languages/erlang'
import * as fortran from '@/lib/monaco/languages/fortran'
import * as haskell from '@/lib/monaco/languages/haskell'
import * as makefile from '@/lib/monaco/languages/makefile'
import * as nim from '@/lib/monaco/languages/nim'
import * as zig from '@/lib/monaco/languages/zig'

type CustomLanguageModule = {
    definition: () => languages.IMonarchLanguage
    configuration?: () => languages.LanguageConfiguration
}

const CUSTOM_LANGUAGES: Record<string, CustomLanguageModule> = {
    ada,
    basic,
    crystal,
    d,
    erlang,
    fortran,
    haskell,
    makefile,
    nim,
    zig,
}

let registered = false

export function registerCustomMonacoLanguages(monaco: Monaco) {
    if (registered) {
        return
    }

    for (const [id, languageModule] of Object.entries(CUSTOM_LANGUAGES)) {
        if (monaco.languages.getLanguages().some((language: { id: string }) => language.id === id)) {
            continue
        }

        monaco.languages.register({ id })
        monaco.languages.setMonarchTokensProvider(id, languageModule.definition())

        if (languageModule.configuration) {
            monaco.languages.setLanguageConfiguration(id, languageModule.configuration())
        }
    }

    registered = true
}
