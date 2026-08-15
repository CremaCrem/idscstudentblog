import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface TagFilterBarProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
}

export const TagFilterBar: React.FC<TagFilterBarProps> = ({ tags, selectedTag, onSelectTag }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftChevron, setShowLeftChevron] = useState(false);
    const [showRightChevron, setShowRightChevron] = useState(true);
    const [isExploreModalOpen, setIsExploreModalOpen] = useState(false); // To be implemented fully later if needed

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftChevron(scrollLeft > 0);
        setShowRightChevron(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    };

    useEffect(() => {
        handleScroll(); // Initial check
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [tags]);

    const scrollBy = (offset: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    return (
        <div className="sticky top-[64px] z-30 bg-stone-50/90 backdrop-blur-md py-4 border-b border-zinc-200 mb-12 -mx-6 px-6">
            <div className="relative flex items-center">
                {/* Left Chevron */}
                <button
                    className={`absolute left-0 z-10 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-opacity duration-200 ${showLeftChevron ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => scrollBy(-250)}
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Scrollable Container */}
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex flex-1 gap-3 overflow-x-auto scrollbar-none scroll-smooth px-2"
                >
                    <Badge
                        className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${selectedTag === null ? '!bg-emerald-800 !text-white' : 'hover:bg-zinc-200'}`}
                        onClick={() => onSelectTag(null)}
                    >
                        View All
                    </Badge>
                    
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${selectedTag === tag ? '!bg-emerald-800 !text-white' : 'hover:bg-zinc-200'}`}
                            onClick={() => onSelectTag(tag)}
                        >
                            {tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Badge>
                    ))}
                    
                    {/* Padding element so the last item isn't hidden under the gradient/button */}
                    <div className="w-8 shrink-0"></div>
                </div>

                {/* Right Edge Gradient Mask */}
                <div className="absolute right-[100px] w-16 h-full bg-gradient-to-r from-transparent to-stone-50 pointer-events-none" />

                {/* Right Chevron */}
                <button
                    className={`absolute right-[110px] z-10 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-opacity duration-200 ${showRightChevron ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => scrollBy(250)}
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Explore All Button */}
                <button
                    onClick={() => setIsExploreModalOpen(true)}
                    className="shrink-0 ml-4 px-3 py-1.5 text-xs font-semibold rounded-full border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors whitespace-nowrap bg-white shadow-sm"
                >
                    + Explore All
                </button>
            </div>
            
            {/* Future Explore All Modal Placeholder */}
            {isExploreModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm px-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-zinc-900">Explore All Topics</h3>
                            <button onClick={() => setIsExploreModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">&times;</button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2">
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        className={`cursor-pointer transition-colors ${selectedTag === tag ? '!bg-emerald-800 !text-white' : 'hover:bg-zinc-200'}`}
                                        onClick={() => {
                                            onSelectTag(tag);
                                            setIsExploreModalOpen(false);
                                        }}
                                    >
                                        {tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
