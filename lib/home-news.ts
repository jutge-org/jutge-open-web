export const HOME_NEWS_DISMISSED_STORAGE_KEY = 'home-news-dismissed'

export type HomeNewsItemId = 'quizzes' | 'vscode' | 'api' | 'llicons'

export function parseHomeNewsDismissedIds(raw: string | null): HomeNewsItemId[] {
    if (!raw) return []

    try {
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []

        return parsed.filter(
            (id): id is HomeNewsItemId =>
                id === 'quizzes' || id === 'vscode' || id === 'api' || id === 'llicons',
        )
    } catch {
        return []
    }
}
