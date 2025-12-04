import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { pb } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, Plus, Type, Image as ImageIcon, AlignLeft, Video, Code } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BlockWrapper } from './blocks/BlockWrapper';
import { TitleBlock } from './blocks/TitleBlock';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { EmbedBlock } from './blocks/EmbedBlock';
import type { ContentBlock } from '@/types';

const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
    excerpt: z.string().optional(),
    status: z.enum(["draft", "published", "hidden", "scheduled"]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectEditorProps {
    projectId?: string;
}

export default function ProjectEditor({ projectId }: ProjectEditorProps) {
    const isNew = projectId === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            status: 'draft',
        }
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (!isNew && projectId) {
            const fetchProject = async () => {
                try {
                    const record = await pb.collection('projects').getOne(projectId);
                    setValue('title', record.title);
                    setValue('slug', record.slug);
                    setValue('excerpt', record.excerpt);
                    setValue('status', record.status);
                    if (record.content_blocks) {
                        setBlocks(record.content_blocks);
                    }
                } catch (e) {
                    console.error("Error fetching project:", e);
                    alert("Error fetching project");
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    }, [projectId, isNew, setValue]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addBlock = (type: ContentBlock['type']) => {
        const newBlock: ContentBlock = {
            id: crypto.randomUUID(),
            type,
            content: type === 'title' ? { text: '', level: 'h2' } :
                type === 'paragraph' ? { html: '<p>Start writing...</p>' } :
                    type === 'image' ? { url: '' } :
                        type === 'video' ? { url: '', provider: 'youtube' } :
                            { code: '' } as any
        };
        setBlocks([...blocks, newBlock]);
    };

    const updateBlock = (id: string, content: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    };

    const deleteBlock = (id: string) => {
        if (confirm('Are you sure you want to delete this block?')) {
            setBlocks(blocks.filter(b => b.id !== id));
        }
    };

    const duplicateBlock = (id: string) => {
        const blockToDuplicate = blocks.find(b => b.id === id);
        if (blockToDuplicate) {
            const newBlock = { ...blockToDuplicate, id: crypto.randomUUID() };
            const index = blocks.findIndex(b => b.id === id);
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            setBlocks(newBlocks);
        }
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setSaving(true);
        try {
            // Handle image uploads first
            const processedBlocks = await Promise.all(blocks.map(async (block) => {
                if (block.type === 'image' && block.content.file) {
                    const formData = new FormData();
                    formData.append('file', block.content.file);
                    const record = await pb.collection('media_library').create(formData);
                    const fileUrl = pb.files.getUrl(record, record.file);
                    return {
                        ...block,
                        content: {
                            ...block.content,
                            url: fileUrl,
                            file: undefined // Remove file object before saving to JSON
                        }
                    };
                }
                return block;
            }));

            const projectData = {
                ...data,
                content_blocks: processedBlocks
            };

            if (isNew) {
                const record = await pb.collection('projects').create(projectData);
                window.location.href = `/admin/editor/${record.id}`;
            } else if (projectId) {
                await pb.collection('projects').update(projectId, projectData);
                setBlocks(processedBlocks); // Update state with processed blocks (URLs instead of Files)
                alert("Saved successfully!");
            }
        } catch (e: any) {
            console.error("Error saving project:", e);
            alert(`Error saving project: ${e.message || JSON.stringify(e)}`);
        } finally {
            setSaving(false);
        }
    };

    const renderBlock = (block: ContentBlock) => {
        switch (block.type) {
            case 'title':
                return <TitleBlock block={block} onChange={(c) => updateBlock(block.id, c)} />;
            case 'paragraph':
                return <ParagraphBlock block={block} onChange={(c) => updateBlock(block.id, c)} />;
            case 'image':
                return <ImageBlock block={block} onChange={(c) => updateBlock(block.id, c)} />;
            case 'video':
                return <VideoBlock block={block} onChange={(c) => updateBlock(block.id, c)} />;
            case 'embed':
                return <EmbedBlock block={block} onChange={(c) => updateBlock(block.id, c)} />;
            default:
                return <div>Unknown block type</div>;
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between sticky top-0 z-50 bg-background/95 backdrop-blur py-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.location.href = '/admin/dashboard'}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">{isNew ? 'New Project' : 'Edit Project'}</h2>
                </div>
                <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" {...register('title')} />
                                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" {...register('slug')} />
                                {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Input id="excerpt" {...register('excerpt')} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={blocks.map(b => b.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {blocks.map((block) => (
                                    <BlockWrapper
                                        key={block.id}
                                        id={block.id}
                                        onDelete={() => deleteBlock(block.id)}
                                        onDuplicate={() => duplicateBlock(block.id)}
                                    >
                                        {renderBlock(block)}
                                    </BlockWrapper>
                                ))}
                            </SortableContext>
                        </DndContext>

                        <div className="flex justify-center gap-2 p-4 border-2 border-dashed rounded-lg flex-wrap">
                            <Button variant="outline" onClick={() => addBlock('title')}>
                                <Type className="mr-2 h-4 w-4" /> Title
                            </Button>
                            <Button variant="outline" onClick={() => addBlock('paragraph')}>
                                <AlignLeft className="mr-2 h-4 w-4" /> Text
                            </Button>
                            <Button variant="outline" onClick={() => addBlock('image')}>
                                <ImageIcon className="mr-2 h-4 w-4" /> Image
                            </Button>
                            <Button variant="outline" onClick={() => addBlock('video')}>
                                <Video className="mr-2 h-4 w-4" /> Video
                            </Button>
                            <Button variant="outline" onClick={() => addBlock('embed')}>
                                <Code className="mr-2 h-4 w-4" /> Embed
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="sticky top-24">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register('status')}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="hidden">Hidden</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
