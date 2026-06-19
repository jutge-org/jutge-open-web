import { useNavigationGuard } from 'next-navigation-guard'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

function confirm() {
    return window.confirm(`There are changes. Are you sure you want to exit the page?`)
}

function onBeforeUnload(this: Window, event: BeforeUnloadEvent) {
    console.log('onBeforeUnload')
    const result = confirm()
    if (!result) {
        event.preventDefault() // block the page from unloading
    }
}

export function usePageChanges(): [boolean, Dispatch<SetStateAction<boolean>>] {
    const [changes, setChanges] = useState<boolean>(false)

    useNavigationGuard({ enabled: changes, confirm })

    useEffect(() => {
        if (changes) {
            window.addEventListener('beforeunload', onBeforeUnload)
            return () => {
                window.removeEventListener('beforeunload', onBeforeUnload)
            }
        }
    }, [changes])

    return [changes, setChanges]
}
