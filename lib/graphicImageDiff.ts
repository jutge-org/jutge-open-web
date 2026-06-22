export type GraphicImageDiffResult = {
    diffImageSrc: string
    difference: number
}

const DIFF_BACKGROUND = { r: 64, g: 64, b: 64 }
const MATCH_COLOR = { r: 255, g: 255, b: 255 }
const OUTPUT_ONLY_COLOR = { r: 255, g: 0, b: 0 }
const EXPECTED_ONLY_COLOR = { r: 0, g: 255, b: 255 }

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = src
    })
}

function isInk(r: number, g: number, b: number, a: number): boolean {
    if (a < 128) {
        return false
    }

    return r < 250 || g < 250 || b < 250
}

function readImageData(img: HTMLImageElement, width: number, height: number): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('Canvas not supported')
    }

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
    return ctx.getImageData(0, 0, width, height)
}

export function formatGraphicImageDifference(value: number): string {
    if (value === 0) {
        return '0'
    }

    return value.toFixed(7).replace(/\.?0+$/, '')
}

export async function computeGraphicImageDiff(
    outputSrc: string,
    expectedSrc: string,
): Promise<GraphicImageDiffResult> {
    const [outputImage, expectedImage] = await Promise.all([loadImage(outputSrc), loadImage(expectedSrc)])

    const width = Math.max(outputImage.naturalWidth, expectedImage.naturalWidth)
    const height = Math.max(outputImage.naturalHeight, expectedImage.naturalHeight)

    const outputData = readImageData(outputImage, width, height)
    const expectedData = readImageData(expectedImage, width, height)
    const diffData = new ImageData(width, height)

    let sumSquaredDiff = 0

    for (let i = 0; i < outputData.data.length; i += 4) {
        const or = outputData.data[i]
        const og = outputData.data[i + 1]
        const ob = outputData.data[i + 2]
        const oa = outputData.data[i + 3]

        const er = expectedData.data[i]
        const eg = expectedData.data[i + 1]
        const eb = expectedData.data[i + 2]
        const ea = expectedData.data[i + 3]

        sumSquaredDiff += (or - er) ** 2 + (og - eg) ** 2 + (ob - eb) ** 2

        const outputInk = isInk(or, og, ob, oa)
        const expectedInk = isInk(er, eg, eb, ea)

        let r: number
        let g: number
        let b: number

        if (outputInk && expectedInk) {
            r = MATCH_COLOR.r
            g = MATCH_COLOR.g
            b = MATCH_COLOR.b
        } else if (outputInk) {
            r = OUTPUT_ONLY_COLOR.r
            g = OUTPUT_ONLY_COLOR.g
            b = OUTPUT_ONLY_COLOR.b
        } else if (expectedInk) {
            r = EXPECTED_ONLY_COLOR.r
            g = EXPECTED_ONLY_COLOR.g
            b = EXPECTED_ONLY_COLOR.b
        } else {
            r = DIFF_BACKGROUND.r
            g = DIFF_BACKGROUND.g
            b = DIFF_BACKGROUND.b
        }

        diffData.data[i] = r
        diffData.data[i + 1] = g
        diffData.data[i + 2] = b
        diffData.data[i + 3] = 255
    }

    const pixelCount = width * height
    const difference = sumSquaredDiff / (pixelCount * 3 * 255 * 255)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('Canvas not supported')
    }

    ctx.putImageData(diffData, 0, 0)

    return {
        diffImageSrc: canvas.toDataURL('image/png'),
        difference,
    }
}
