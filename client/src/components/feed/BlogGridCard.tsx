import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { BlogPost } from '../../services/blog';

interface BlogGridCardProps {
    post: BlogPost;
}

export const BlogGridCard: React.FC<BlogGridCardProps> = ({ post }) => {
    // Determine author name
    const authorName = (typeof post.authorId === 'object' && post.authorId !== null && post.authorId.username)
        ? post.authorId.username
        : 'Unknown Author';

    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return (
        <a
            href={post.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline group h-full"
        >
            <Card hoverEffect className="cursor-pointer flex flex-col h-full border-zinc-200">
                <div className="relative aspect-video">
                    {post.thumbnailUrl ? (
                        <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                            <span className="text-zinc-400">No Image</span>
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-white/40 backdrop-blur-xl rounded-full p-0.5">
                        <Badge variant="default">{authorName}</Badge>
                    </div>
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1 bg-white">
                    <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 3).map(tag => (
                            <Badge key={tag} className="!text-xs !px-2 !py-0.5">{tag}</Badge>
                        ))}
                    </div>
                    <h4 className="font-semibold text-lg text-zinc-900 group-hover:underline m-0 line-clamp-2">{post.title}</h4>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="text-xs text-zinc-500 font-medium">{formattedDate}</span>
                        <div className="text-sm font-semibold text-emerald-800 flex items-center gap-1">
                            Read Article on Author's Site <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                    </div>
                </div>
            </Card>
        </a>
    );
};
