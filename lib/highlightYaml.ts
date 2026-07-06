import hljs from 'highlight.js/lib/core'
import yamlLanguage from 'highlight.js/lib/languages/yaml'
import { stringify } from 'yaml'

hljs.registerLanguage('yaml', yamlLanguage)

export function objectToYaml(value: unknown): string {
    return stringify(value, { lineWidth: 0 })
}

export function highlightYaml(yamlText: string): string {
    return hljs.highlight(yamlText, { language: 'yaml' }).value
}

export function highlightYamlObject(value: unknown): string {
    return highlightYaml(objectToYaml(value))
}
