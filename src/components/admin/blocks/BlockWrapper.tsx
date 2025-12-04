import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockWrapperProps {
    id: string;
    onDelete: () => void;
    onDuplicate: () => void;
    children: React.ReactNode;
}

export function BlockWrapper({ id, onDelete, onDuplicate, children }: BlockWrapperProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("relative group", isDragging && "opacity-50 z-50")}>
            <Card className="mb-4">
                <div className="flex items-start">
                    <div
                        {...attributes}
                        {...listeners}
                        className="p-4 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                    >
                        <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 p-4 pl-0">
                        {children}
                    </div>
                    <div className="p-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={onDuplicate} title="Duplicate">
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onDelete} title="Delete" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
