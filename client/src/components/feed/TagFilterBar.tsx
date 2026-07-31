import React from 'react';
import { Badge } from '../ui/Badge';

interface TagFilterBarProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
}

export const TagFilterBar: React.FC<TagFilterBarProps> = ({ tags, selectedTag, onSelectTag }) => {
    return (
        <div className="sticky top-[64px] z-30 bg-stone-50/90 backdrop-blur-md py-4 border-b border-zinc-200 mb-12 -mx-6 px-6">
            <div className="flex gap-3 overflow-x-auto scrollbar-none">
                <Badge
                    className={`cursor-pointer transition-colors ${selectedTag === null ? '!bg-emerald-800 !text-white' : 'hover:bg-zinc-200'}`}
                    onClick={() => onSelectTag(null)}
                >
                    View All
                </Badge>
                
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        className={`cursor-pointer transition-colors ${selectedTag === tag ? '!bg-emerald-800 !text-white' : 'hover:bg-zinc-200'}`}
                        onClick={() => onSelectTag(tag)}
                    >
                        {tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                ))}
            </div>
        </div>
    );
};
