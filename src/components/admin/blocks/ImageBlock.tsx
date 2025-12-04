import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import type { ImageBlock as ImageBlockType } from '@/types';

interface ImageBlockProps {
    block: ImageBlockType;
    onChange: (content: ImageBlockType['content']) => void;
}

export function ImageBlock({ block, onChange }: ImageBlockProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onChange({ ...block.content, url, file });
        }
    };

    const handleClear = () => {
        onChange({ ...block.content, url: '', file: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {block.content.url ? (
                <div className="relative group">
                    <img
                        src={block.content.url}
                        alt={block.content.alt || 'Preview'}
                        className="max-h-[300px] rounded-md object-cover border"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            )}

            <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label>Alt Text</Label>
                        <Input
                            value={block.content.alt || ''}
                            onChange={(e) => onChange({ ...block.content, alt: e.target.value })}
                            placeholder="Image description"
                        />
                    </div>
                    <div>
                        <Label>Caption</Label>
                        <Input
                            value={block.content.caption || ''}
                            onChange={(e) => onChange({ ...block.content, caption: e.target.value })}
                            placeholder="Image caption"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
