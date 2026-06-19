import { type DependencyList, type Dispatch, type SetStateAction, useEffect, useState } from 'react'

export function useDynamic<T>(init: T, deps: DependencyList): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState(init)

    useEffect(() => {
        setValue(init)
    }, deps)

    return [value, setValue]
}
