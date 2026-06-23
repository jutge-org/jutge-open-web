export function decodeBase64Utf8(b64: string): string {
    const binary = atob(b64)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
}

export function decodeBase64Bytes(b64: string): Uint8Array {
    const binary = atob(b64)
    return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}
