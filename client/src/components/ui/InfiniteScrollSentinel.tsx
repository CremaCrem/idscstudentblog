import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollSentinelProps {
    onIntersect: () => void;
    isFetchingMore: boolean;
    hasMore: boolean;
}

export const InfiniteScrollSentinel: React.FC<InfiniteScrollSentinelProps> = ({ onIntersect, isFetchingMore, hasMore }) => {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingMore) {
                    onIntersect();
                }
            },
            {
                root: null,
                rootMargin: '100px', // Trigger fetch slightly before reaching the bottom
                threshold: 0.1,
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, [hasMore, isFetchingMore, onIntersect]);

    if (!hasMore) {
        return (
            <div className="py-8 text-center text-zinc-500 text-sm">
                You've reached the end of the feed.
            </div>
        );
    }

    return (
        <div ref={sentinelRef} className="w-full py-8 flex justify-center">
            {isFetchingMore && (
                <div className="flex items-center gap-2 text-zinc-500 bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Loading more...</span>
                </div>
            )}
        </div>
    );
};
