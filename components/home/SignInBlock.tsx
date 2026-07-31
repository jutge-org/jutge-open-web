'use client'

import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { useAuth } from '@/components/AuthProvider'
import { RecaptchaNotice } from '@/components/registration/RecaptchaNotice'
import AnimatedTabs from '@/components/smoothui/animated-tabs'
import SmoothButton from '@/components/smoothui/smooth-button'
import { requestPasswordResetAction } from '@/lib/data/passwordResetActions'
import { getRecaptchaSiteKey, RECAPTCHA_PASSWORD_RESET_ACTION } from '@/lib/recaptcha'
import { cn } from '@/lib/utils'
import { BookMarkedIcon, LockOpenIcon, LogInIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useId, useRef, useState, useTransition, type FormEvent } from 'react'
import { toast } from 'sonner'
import validator from 'validator'

const TABS = [
    { id: 'signup', label: 'Sign up', icon: <BookMarkedIcon className="size-4" aria-hidden /> },
    { id: 'signin', label: 'Sign in', icon: <LogInIcon className="size-4" aria-hidden /> },
    {
        id: 'reset',
        label: 'Reset password',
        icon: <LockOpenIcon className="size-4" aria-hidden />,
    },
]

type TabId = 'signin' | 'signup' | 'reset'

const ACCOUNT_TABS_LAYOUT_ID = 'home-account-tabs'

const underlineInputClass = cn(
    'min-w-0 flex-1 border-0 border-b border-foreground/30 bg-transparent px-0 py-1.5 text-sm text-foreground',
    'placeholder:text-transparent',
    'outline-none transition-[border-color] duration-200',
    'focus-visible:border-foreground',
    'aria-invalid:border-destructive',
)

const labelClass = 'w-20 shrink-0 text-right text-sm text-foreground mr-2'

function SignInPanel() {
    const { login } = useAuth()
    const formId = useId()
    const emailId = `${formId}-email`
    const passwordId = `${formId}-password`
    const errorId = `${formId}-error`

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const canSubmit = validator.isEmail(email.trim()) && password.length >= 8 && !pending

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrorMessage(null)

        const trimmed = email.trim()
        if (!validator.isEmail(trimmed)) {
            setErrorMessage('Please enter a valid email address.')
            emailRef.current?.focus()
            return
        }
        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters.')
            passwordRef.current?.focus()
            return
        }

        startTransition(async () => {
            const result = await login({ email: trimmed, password })
            if (!result.ok) {
                setErrorMessage(result.error)
                passwordRef.current?.focus()
                return
            }
            toast.success(`Signed in as ${result.userName}`)
            setEmail('')
            setPassword('')
        })
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mx-auto flex w-96 max-w-full flex-col gap-4">
            <div className="flex items-baseline gap-3">
                <label htmlFor={emailId} className={labelClass}>
                    Email:
                </label>
                <input
                    ref={emailRef}
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                    }}
                    aria-invalid={errorMessage ? true : undefined}
                    aria-describedby={errorMessage ? errorId : undefined}
                    className={underlineInputClass}
                />
            </div>
            <div className="flex items-baseline gap-3">
                <label htmlFor={passwordId} className={labelClass}>
                    Password:
                </label>
                <input
                    ref={passwordRef}
                    id={passwordId}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                    }}
                    aria-invalid={errorMessage ? true : undefined}
                    aria-describedby={errorMessage ? errorId : undefined}
                    className={underlineInputClass}
                />
            </div>
            <div className="flex items-baseline gap-3">
                <div className={labelClass} aria-hidden />
                <SmoothButton
                    type="submit"
                    color="accent"
                    variant="candy"
                    disabled={!canSubmit}
                    className="min-w-0 flex-1 h-8 mt-4"
                >
                    <LogInIcon className="size-4" aria-hidden />
                    {pending ? 'Signing in…' : 'Sign in'}
                </SmoothButton>
            </div>

            {errorMessage ? (
                <p id={errorId} role="alert" className="text-sm text-destructive">
                    {errorMessage}
                </p>
            ) : null}
        </form>
    )
}

function ResetPasswordPanelFields({
    recaptchaConfigured,
    executeRecaptcha,
}: {
    recaptchaConfigured: boolean
    executeRecaptcha?: (action?: string) => Promise<string>
}) {
    const formId = useId()
    const emailId = `${formId}-email`
    const errorId = `${formId}-error`

    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()
    const emailRef = useRef<HTMLInputElement>(null)
    const canSubmit = validator.isEmail(email.trim()) && !pending

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrorMessage(null)

        const trimmed = email.trim()
        if (!validator.isEmail(trimmed)) {
            setErrorMessage('Please enter a valid email address.')
            emailRef.current?.focus()
            return
        }
        if (!recaptchaConfigured) {
            setErrorMessage('Password reset is not available because reCAPTCHA is not configured.')
            return
        }

        startTransition(async () => {
            if (!executeRecaptcha) {
                setErrorMessage('Security check is not ready yet. Please try again.')
                return
            }

            const token = await executeRecaptcha(RECAPTCHA_PASSWORD_RESET_ACTION)
            if (!token) {
                setErrorMessage('Security check failed. Please try again.')
                return
            }

            const result = await requestPasswordResetAction({
                email: trimmed,
                recaptcha_token: token,
            })
            if (!result.ok) {
                setErrorMessage(result.error)
                emailRef.current?.focus()
                return
            }

            toast.success('Password reset email sent. Check your inbox.')
            setEmail('')
        })
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mx-auto flex w-96 max-w-full flex-col gap-4">
            <div className="flex items-baseline gap-3">
                <label htmlFor={emailId} className={labelClass}>
                    Email:
                </label>
                <input
                    ref={emailRef}
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                    }}
                    aria-invalid={errorMessage ? true : undefined}
                    aria-describedby={errorMessage ? errorId : undefined}
                    className={underlineInputClass}
                />
            </div>
            <div className="flex items-baseline gap-3">
                <div className={labelClass} aria-hidden />
                <SmoothButton
                    type="submit"
                    color="accent"
                    variant="candy"
                    disabled={!canSubmit}
                    className="min-w-0 flex-1 h-8 mt-4"
                >
                    <LockOpenIcon className="size-4" aria-hidden />
                    {pending ? 'Sending…' : 'Reset password'}
                </SmoothButton>
            </div>

            {errorMessage ? (
                <p id={errorId} role="alert" className="text-sm text-destructive">
                    {errorMessage}
                </p>
            ) : null}

            <div className="flex items-baseline gap-3">
                <div className={labelClass} aria-hidden />
                <div className="min-w-0 flex-1">
                    <RecaptchaNotice configured={recaptchaConfigured} />
                </div>
            </div>
        </form>
    )
}

function ResetPasswordPanelWithRecaptcha() {
    const { executeRecaptcha } = useGoogleReCaptcha()

    return <ResetPasswordPanelFields recaptchaConfigured executeRecaptcha={executeRecaptcha ?? undefined} />
}

function ResetPasswordPanel() {
    const siteKey = getRecaptchaSiteKey()

    if (!siteKey) {
        return <ResetPasswordPanelFields recaptchaConfigured={false} />
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
            <ResetPasswordPanelWithRecaptcha />
        </GoogleReCaptchaProvider>
    )
}

function SignUpPanel() {
    return (
        <div className="flex justify-center px-4">
            <SmoothButton asChild color="accent" variant="candy" className='w-32'>
                <Link href="/registration">
                    <BookMarkedIcon className="size-4 shrink-0" aria-hidden />
                    Sign up
                </Link>
            </SmoothButton>
        </div>
    )
}

export function SignInBlock() {
    const shouldReduceMotion = useReducedMotion()
    const [activeTab, setActiveTab] = useState<TabId>('signin')

    return (
        <section aria-label="Account" className="py-4 md:py-8">
            <div className="w-full px-6">
                <motion.div
                    className="flex flex-col gap-6 rounded-xl border bg-primary/5 px-2 pt-2 pb-8 ring-1 ring-primary/10"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.35, bounce: 0.1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                >
                    <AnimatedTabs
                        activeTab={activeTab}
                        className="w-full"
                        layoutId={ACCOUNT_TABS_LAYOUT_ID}
                        onChange={(tabId) => setActiveTab(tabId as TabId)}
                        tabs={TABS}
                        variant="underline"
                    />

                    <div
                        aria-labelledby={`${ACCOUNT_TABS_LAYOUT_ID}-tab-${activeTab}`}
                        id={`${ACCOUNT_TABS_LAYOUT_ID}-panel-${activeTab}`}
                        role="tabpanel"
                        className="pt-2"
                    >
                        {activeTab === 'signin' ? <SignInPanel /> : null}
                        {activeTab === 'signup' ? <SignUpPanel /> : null}
                        {activeTab === 'reset' ? <ResetPasswordPanel /> : null}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
