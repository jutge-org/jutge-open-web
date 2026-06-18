'use client'

import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'

const HtmlEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'min-h-[150px] max-h-[150px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto',
            },
        },
        extensions: [
            StarterKit.configure({
                orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
                bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    return (
        <>
            <EditorContent editor={editor} />
            {editor ? <HtmlEditorToolbar editor={editor} /> : null}
        </>
    )
}

function HtmlEditorToolbar({ editor }: { editor: Editor }) {
    return (
        <div className="flex flex-row items-center gap-1 rounded-br-md rounded-bl-md border border-input bg-transparent p-1">
            <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Separator orientation="vertical" className="h-8 w-px" />
            <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="h-4 w-4" />
            </Toggle>
        </div>
    )
}

export default HtmlEditor
