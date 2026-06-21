import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function normalizeForSearch(text: string): string {
    return text
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
}

export function includesForSearch(haystack: string, query: string): boolean {
    return normalizeForSearch(haystack).includes(normalizeForSearch(query))
}

export function commandFilter(value: string, search: string): number {
    return includesForSearch(value, search) ? 1 : 0
}
