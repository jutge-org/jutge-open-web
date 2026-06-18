export function emailRenderer(field: string) {
    return function EmailComponent(p: { data: Record<string, string> }) {
        const parts = p.data[field].split('@')
        return (
            <div>
                {parts[0]}
                <span className="text-xs text-muted-foreground">@{parts[1]}</span>
            </div>
        )
    }
}
