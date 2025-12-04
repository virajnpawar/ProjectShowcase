import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import type { ParagraphBlock as ParagraphBlockType } from '@/types';

interface ParagraphBlockProps {
    block: ParagraphBlockType;
    onChange: (content: ParagraphBlockType['content']) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex gap-1 border-b p-1 mb-2">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1 rounded ${editor.isActive('bold') ? 'bg-muted' : ''}`}
                type="button"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1 rounded ${editor.isActive('italic') ? 'bg-muted' : ''}`}
                type="button"
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
                type="button"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
                type="button"
            >
                <ListOrdered className="h-4 w-4" />
            </button>
        </div>
    );
};

export function ParagraphBlock({ block, onChange }: ParagraphBlockProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: block.content.html,
        onUpdate: ({ editor }) => {
            onChange({ html: editor.getHTML() });
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[100px] px-2',
            },
        },
    });

    return (
        <div className="border rounded-md">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
