'use client'

import { AllCommunityModule, colorSchemeDark, colorSchemeLight, ModuleRegistry, themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useTheme } from 'next-themes'
import { useLayoutEffect, useRef, useState, type RefObject } from 'react'

ModuleRegistry.registerModules([AllCommunityModule])

type GridProps = {
    wrapperBorder?: boolean
    themeParams?: Record<string, string>
    rowData?: any[]
    columnDefs?: any[]
    [key: string]: any
}

const myThemeLight = themeQuartz.withPart(colorSchemeLight).withParams({
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    accentColor: 'gray',
})

const myThemeDark = themeQuartz.withPart(colorSchemeDark).withParams({
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    accentColor: 'gray',
    backgroundColor: '#0b0a0b',
})

function useAgTheme(wrapperBorder = true, themeParams?: Record<string, string>) {
    const { resolvedTheme } = useTheme()
    const baseTheme = resolvedTheme === 'dark' ? myThemeDark : myThemeLight
    const params = {
        ...(wrapperBorder ? {} : { wrapperBorder: false }),
        ...themeParams,
    }
    return Object.keys(params).length > 0 ? baseTheme.withParams(params) : baseTheme
}

const BOTTOM_PADDING_PX = 60

const AG_TABLE_CLASS = 'w-full [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-muted-foreground/50'

function useViewportTableHeight(containerRef: RefObject<HTMLDivElement | null>) {
    const [height, setHeight] = useState<number>()

    useLayoutEffect(() => {
        const container = containerRef.current
        if (!container) return

        function updateHeight() {
            const el = containerRef.current
            const footerEl = document.querySelector('footer')
            if (!el) return

            const top = el.getBoundingClientRect().top
            const footerHeight = footerEl?.getBoundingClientRect().height ?? 0
            setHeight(Math.max(0, window.innerHeight - top - footerHeight - BOTTOM_PADDING_PX))
        }

        updateHeight()

        const observer = new ResizeObserver(updateHeight)
        const footer = document.querySelector('footer')
        if (footer) observer.observe(footer)
        const main = document.querySelector('main')
        if (main) observer.observe(main)

        window.addEventListener('resize', updateHeight)

        return () => {
            observer.disconnect()
            window.removeEventListener('resize', updateHeight)
        }
    }, [containerRef])

    return height
}

export function AgTableFull({ wrapperBorder = true, themeParams, ...props }: GridProps) {
    const theme = useAgTheme(wrapperBorder, themeParams)
    const containerRef = useRef<HTMLDivElement>(null)
    const height = useViewportTableHeight(containerRef)

    return (
        <div ref={containerRef} className={AG_TABLE_CLASS} style={height !== undefined ? { height } : undefined}>
            <AgGridReact
                {...props}
                theme={theme}
                animateRows={false}
                suppressColumnMoveAnimation={true}
                enableCellTextSelection={true}
                ensureDomOrder={true}
            />
        </div>
    )
}

export function AgTable({ wrapperBorder = true, themeParams, ...props }: GridProps) {
    const theme = useAgTheme(wrapperBorder, themeParams)

    return (
        <div className={`${AG_TABLE_CLASS} h-full`}>
            <AgGridReact
                {...props}
                theme={theme}
                animateRows={false}
                suppressColumnMoveAnimation={true}
                enableCellTextSelection={true}
                ensureDomOrder={true}
            />
        </div>
    )
}

export function AgTableAutoHeight({ wrapperBorder = true, themeParams, ...props }: GridProps) {
    const theme = useAgTheme(wrapperBorder, themeParams)

    return (
        <div className={AG_TABLE_CLASS}>
            <AgGridReact
                {...props}
                theme={theme}
                domLayout="autoHeight"
                animateRows={false}
                suppressColumnMoveAnimation={true}
                enableCellTextSelection={true}
                ensureDomOrder={true}
            />
        </div>
    )
}
