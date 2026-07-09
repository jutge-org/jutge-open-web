import { LightbulbIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export function ExamsReminderAlert() {
    return null

    // TODO?
    return (
        <Alert className="border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            <LightbulbIcon aria-hidden />
            <AlertDescription>
                Remember that exams take place at{' '}
                <Link href="https://exam.jutge.org" className="text-primary">
                    https://exam.jutge.org
                </Link>{' '}
                and contests take place at{' '}
                <Link href="https://contest.jutge.org" className="text-primary">
                    https://contest.jutge.org
                </Link>
                .
            </AlertDescription>
        </Alert>
    )
}
