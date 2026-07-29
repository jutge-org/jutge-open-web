'use client'

import { documentTitleFromBreadcrumbs } from '@/lib/documentTitle'
import { useMainBreadcrumbs, type MainBreadcrumbSegment } from '@/store/MainBreadcrumbs'
import { useEffect } from 'react'

export type MainBreadcrumbsProps = {
    breadcrumbs: readonly MainBreadcrumbSegment[]
}

export default function MainBreadcrumbs(props: MainBreadcrumbsProps) {
    const setBreadcrumbs = useMainBreadcrumbs((s) => s.setBreadcrumbs)

    useEffect(() => {
        setBreadcrumbs(props.breadcrumbs)
        document.title = documentTitleFromBreadcrumbs(props.breadcrumbs)
    }, [props.breadcrumbs, setBreadcrumbs])

    return null
}
