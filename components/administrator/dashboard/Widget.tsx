'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface WidgetProps {
    icon: ReactNode
    title?: string
    content: React.ReactNode
    actions?: React.ReactNode
}

export default function Widget(props: WidgetProps) {
    return (
        <Card>
            {props.title && (
                <CardHeader className="">
                    <CardTitle className="p-0 flex flex-row gap-2 items-center">
                        {props.icon}
                        {props.title}
                        <div className="grow" />
                        {props.actions && props.actions}
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent className="px-2 py-0">
                <div className="flex flex-row">{props.content}</div>
            </CardContent>
        </Card>
    )
}
