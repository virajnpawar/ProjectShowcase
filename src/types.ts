export type BlockType = 'title' | 'paragraph' | 'image' | 'video' | 'embed';

export interface BaseBlock {
    id: string;
    type: BlockType;
}

export interface TitleBlock extends BaseBlock {
    type: 'title';
    content: {
        text: string;
        level: 'h1' | 'h2' | 'h3';
    };
}

export interface ParagraphBlock extends BaseBlock {
    type: 'paragraph';
    content: {
        html: string;
    };
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    content: {
        url: string;
        alt?: string;
        caption?: string;
        file?: File | null; // For upload handling
    };
}

export interface VideoBlock extends BaseBlock {
    type: 'video';
    content: {
        url: string;
        provider?: 'youtube' | 'vimeo' | 'other';
    };
}

export interface EmbedBlock extends BaseBlock {
    type: 'embed';
    content: {
        code: string;
    };
}

export type ContentBlock = TitleBlock | ParagraphBlock | ImageBlock | VideoBlock | EmbedBlock;
