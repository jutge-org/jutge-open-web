type RecaptchaNoticeProps = {
    configured: boolean
}

export function RecaptchaNotice({ configured }: RecaptchaNoticeProps) {
    if (!configured) {
        return (
            <p className="text-xs text-muted-foreground">
                reCAPTCHA is not configured. Set <code className="text-[0.7rem]">NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code>{' '}
                to enable registration protection.
            </p>
        )
    }

    return (
        <p className="text-xs text-muted-foreground">
            This site is protected by reCAPTCHA and the Google{' '}
            <a
                href="https://policies.google.com/privacy"
                className="text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
            >
                Privacy Policy
            </a>{' '}
            and{' '}
            <a
                href="https://policies.google.com/terms"
                className="text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
            >
                Terms of Service
            </a>{' '}
            apply.
        </p>
    )
}
