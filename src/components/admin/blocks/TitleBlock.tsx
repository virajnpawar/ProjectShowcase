import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { TitleBlock as TitleBlockType } from '@/types';

interface TitleBlockProps {
    block: TitleBlockType;
    onChange: (content: TitleBlockType['content']) => void;
}

export function TitleBlock({ block, onChange }: TitleBlockProps) {
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Select
                    value={block.content.level}
                    onValueChange={(value: any) => onChange({ ...block.content, level: value as any })}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="h1">H1</SelectItem>
                        <SelectItem value="h2">H2</SelectItem>
                        <SelectItem value="h3">H3</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    value={block.content.text}
                    onChange={(e) => onChange({ ...block.content, text: e.target.value })}
                    placeholder="Enter title..."
                    className="flex-1 font-bold"
                />
            </div>
        </div>
    );
}
