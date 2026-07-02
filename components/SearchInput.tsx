'use client'

import { MicIcon, MicOffIcon, SearchIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type SearchInputProps = Omit<ComponentProps<typeof Input>, 'type'> & {
    showSearchIcon?: boolean
    type?: ComponentProps<typeof Input>['type']
}

export function SearchInput({
    className,
    showSearchIcon = false,
    type = 'search',
    value,
    onChange,
    ...props
}: SearchInputProps) {
    const handleTranscript = (transcript: string) => {
        if (!onChange) return
        const syntheticEvent = {
            target: { value: transcript },
            currentTarget: { value: transcript },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
    }

    const { isListening, startListening, stopListening, supported } = useSpeechRecognition(handleTranscript)

    const toggleListening = () => {
        if (isListening) {
            stopListening()
            return
        }
        if (!supported) {
            toast.error('Speech recognition is not supported in your browser')
            return
        }
        startListening()
    }

    return (
        <div className={cn('relative w-full', className)}>
            {showSearchIcon ? (
                <SearchIcon
                    className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />
            ) : null}
            <Input
                type={type}
                value={value}
                onChange={onChange}
                className={cn('w-full', showSearchIcon ? 'pl-9 pr-10' : 'pr-10')}
                {...props}
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(
                                'absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground',
                                isListening && 'text-destructive hover:text-destructive',
                            )}
                            onClick={toggleListening}
                            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                        >
                            {isListening ? <MicOffIcon className="size-4" /> : <MicIcon className="size-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{isListening ? 'Stop listening' : 'Voice input'}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
