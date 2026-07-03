import { LightbulbIcon } from 'lucide-react'

import { ExternalLink } from '@/components/ExternalLink'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ExamsReminderAlert() {
    return (
        <Alert className="border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            <LightbulbIcon aria-hidden />
            <AlertDescription>
                TODO: Improve this page (status instaed of finished, add running time, use it in calendar duration)
                Remember that exams take place at{' '}
                <ExternalLink href="https://exam.jutge.org" className="text-primary">
                    https://exam.jutge.org
                </ExternalLink>{' '}
                and contests take place at{' '}
                <ExternalLink href="https://contest.jutge.org" className="text-primary">
                    https://contest.jutge.org
                </ExternalLink>
                .
            </AlertDescription>
        </Alert>
    )
}
