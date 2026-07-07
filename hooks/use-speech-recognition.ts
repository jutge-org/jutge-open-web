'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type SpeechRecognitionResultList = {
    length: number
    [index: number]: { 0: { transcript: string } }
}

type SpeechRecognitionEvent = {
    results: SpeechRecognitionResultList
}

type SpeechRecognitionInstance = {
    continuous: boolean
    interimResults: boolean
    start: () => void
    stop: () => void
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onend: (() => void) | null
    onerror: (() => void) | null
}

function getSpeechRecognitionConstructor(): (new () => SpeechRecognitionInstance) | null {
    if (typeof window === 'undefined') return null
    const w = window as Window & {
        SpeechRecognition?: new () => SpeechRecognitionInstance
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance
    }
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function useSpeechRecognition(onTranscript: (transcript: string) => void) {
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
    const onTranscriptRef = useRef(onTranscript)
    onTranscriptRef.current = onTranscript

    const supported = typeof window !== 'undefined' && getSpeechRecognitionConstructor() !== null

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            recognitionRef.current = null
        }
        setIsListening(false)
    }, [])

    const startListening = useCallback(() => {
        const SpeechRecognition = getSpeechRecognitionConstructor()
        if (!SpeechRecognition) return false

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event) => {
            const transcript = Array.from(
                { length: event.results.length },
                (_, index) => event.results[index][0].transcript,
            ).join('')
            onTranscriptRef.current(transcript)
        }

        recognition.onend = () => {
            setIsListening(false)
            recognitionRef.current = null
        }

        recognition.onerror = () => {
            setIsListening(false)
            recognitionRef.current = null
        }

        recognitionRef.current = recognition
        recognition.start()
        setIsListening(true)
        return true
    }, [])

    useEffect(() => {
        return () => {
            recognitionRef.current?.stop()
        }
    }, [])

    return { isListening, startListening, stopListening, supported }
}
