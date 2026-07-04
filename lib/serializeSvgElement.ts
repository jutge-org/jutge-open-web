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

    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const source = new XMLSerializer().serializeToString(clone)
    return `<?xml version="1.0" encoding="UTF-8"?>\n${source}`
}
