import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { VideoBlock as VideoBlockType } from '@/types';

interface VideoBlockProps {
    block: VideoBlockType;
    onChange: (content: VideoBlockType['content']) => void;
}

export function VideoBlock({ block, onChange }: VideoBlockProps) {
    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label>Video URL</Label>
                <div className="flex gap-2">
                    <Select
                        value={block.content.provider || 'youtube'}
                        onValueChange={(value) => onChange({ ...block.content, provider: value as any })}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="vimeo">Vimeo</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        value={block.content.url}
                        onChange={(e) => onChange({ ...block.content, url: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1"
                    />
                </div>
            </div>
            {block.content.url && (
                <div className="aspect-video w-full rounded-md border bg-muted flex items-center justify-center text-muted-foreground">
                    Preview not available in editor
                </div>
            )}
        </div>
    );
}
