'use client'

import {
    AllCommunityModule,
    colorSchemeDark,
    colorSchemeLight,
    ModuleRegistry,
    themeQuartz,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useTheme } from 'next-themes'

ModuleRegistry.registerModules([AllCommunityModule])

type GridProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData?: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columnDefs?: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

function useAgTheme() {
    const { resolvedTheme } = useTheme()
    return resolvedTheme === 'dark' ? myThemeDark : myThemeLight
}

export function AgTableFull(props: GridProps) {
    const theme = useAgTheme()

    return (
        <div className="h-[calc(100vh-200px)] w-full">
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

export function AgTable(props: GridProps) {
    const theme = useAgTheme()

    return (
        <AgGridReact
            {...props}
            theme={theme}
            animateRows={false}
            suppressColumnMoveAnimation={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
        />
    )
}

export function AgTableAutoHeight(props: GridProps) {
    const theme = useAgTheme()

    return (
        <div className="w-full">
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
