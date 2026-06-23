import { FileArchiveIcon, FileTextIcon, type LucideIcon } from 'lucide-react'
import type { Document } from '@/lib/jutge_api_client'

import type { JutgeApiClient } from '@/lib/jutge_api_client'

export function isDocumentZip(document: Pick<Document, 'type'>): boolean {
    return document.type.toLowerCase().includes('zip')
}

export function documentFileExtension(document: Pick<Document, 'type'>): string {
    return isDocumentZip(document) ? '.zip' : '.pdf'
}

export function getDocumentFileIcon(type: string): LucideIcon {
    return type.toLowerCase().includes('zip') ? FileArchiveIcon : FileTextIcon
}

export async function getDocumentFile(client: JutgeApiClient, document: Pick<Document, 'document_nm' | 'type'>) {
    if (isDocumentZip(document)) {
        return client.instructor.documents.getZip(document.document_nm)
    }
    return client.instructor.documents.getPdf(document.document_nm)
}

export function documentTypeLabel(document: Pick<Document, 'type'>): 'PDF' | 'Zip' {
    return isDocumentZip(document) ? 'Zip' : 'PDF'
}

export function documentFileAcceptForType(type: string): string[] {
    return type.toLowerCase().includes('zip')
        ? ['application/zip', 'application/x-zip-compressed']
        : ['application/pdf']
}

export const documentFileAccept = ['application/pdf', 'application/zip', 'application/x-zip-compressed']
