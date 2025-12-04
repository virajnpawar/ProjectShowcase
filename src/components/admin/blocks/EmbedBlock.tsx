import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Need to create Textarea
import type { EmbedBlock as EmbedBlockType } from '@/types';

interface EmbedBlockProps {
    block: EmbedBlockType;
    onChange: (content: EmbedBlockType['content']) => void;
}

export function EmbedBlock({ block, onChange }: EmbedBlockProps) {
    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label>Embed Code</Label>
                <Textarea
                    value={block.content.code}
                    onChange={(e) => onChange({ ...block.content, code: e.target.value })}
                    placeholder="<iframe src='...'></iframe>"
                    className="font-mono text-sm min-h-[100px]"
                />
            </div>
        </div>
    );
}
