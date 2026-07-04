const DEFAULT_SVG_FONT_FAMILY = 'sans-serif'

function setFontFamily(element: Element): void {
    const style = element.getAttribute('style')
    if (style?.match(/font-family\s*:/i)) {
        element.setAttribute(
            'style',
            style.replace(/font-family\s*:[^;]+;?/i, `font-family: ${DEFAULT_SVG_FONT_FAMILY};`),
        )
    } else {
        element.setAttribute('font-family', DEFAULT_SVG_FONT_FAMILY)
    }
}

export function serializeSvgElement(svg: SVGSVGElement): string {
    const clone = svg.cloneNode(true) as SVGSVGElement
    const color = getComputedStyle(svg).color

    clone.querySelectorAll('[stroke="currentColor"]').forEach((node) => {
        node.setAttribute('stroke', color)
    })

    clone.querySelectorAll('[class*="fill-current"]').forEach((node) => {
        node.setAttribute('fill', color)
        node.removeAttribute('class')
    })

    setFontFamily(clone)
    clone.querySelectorAll('text, tspan').forEach(setFontFamily)

    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const source = new XMLSerializer().serializeToString(clone)
    return `<?xml version="1.0" encoding="UTF-8"?>\n${source}`
}
