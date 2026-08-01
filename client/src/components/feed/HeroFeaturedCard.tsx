import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { BlogPost } from '../../services/blog';

interface HeroFeaturedCardProps {
    featuredPosts: BlogPost[];
}

export const HeroFeaturedCard: React.FC<HeroFeaturedCardProps> = ({ featuredPosts }) => {
    if (!featuredPosts || featuredPosts.length === 0) {
        return null; // Return null or empty state if no featured posts
    }

    const primaryPost = featuredPosts[0];
    const secondaryPosts = featuredPosts.slice(1, 3); // Max 2 additional posts

    const getAuthorName = (authorId: any) => {
        return (typeof authorId === 'object' && authorId !== null && authorId.username) ? authorId.username : 'Unknown Author';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <a
                href={primaryPost.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline lg:col-span-2 group"
            >
                <Card hoverEffect className="h-[500px] cursor-pointer border-zinc-200">
                    <div className="w-full h-full relative">
                        {primaryPost.thumbnailUrl ? (
                            <img
                                src={primaryPost.thumbnailUrl}
                                alt={primaryPost.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                                <span className="text-zinc-400">No Image</span>
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-4 items-start bg-white/60 backdrop-blur-xl border-t border-white/40">
                            {primaryPost.tags && primaryPost.tags.length > 0 && (
                                <Badge variant="default">[{primaryPost.tags[0]}]</Badge>
                            )}
                            <h2 className="font-display text-3xl font-bold text-zinc-900 group-hover:underline m-0 line-clamp-2">{primaryPost.title}</h2>
                            <div className="text-sm text-zinc-700 font-medium">
                                {getAuthorName(primaryPost.authorId)} • {formatDate(primaryPost.createdAt)}
                            </div>
                        </div>
                    </div>
                </Card>
            </a>

            {secondaryPosts.length > 0 && (
                <div className="flex flex-col">
                    <h3 className="font-semibold text-lg text-zinc-900 border-b border-zinc-200 pb-2 mb-6 mt-0">Latest Posts</h3>
                    <div className="flex flex-col gap-6">
                        {secondaryPosts.map(post => (
                            <a
                                key={post._id}
                                href={post.targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block no-underline group"
                            >
                                <Card hoverEffect className="flex h-[120px] cursor-pointer border-zinc-200">
                                    <div className="w-[140px] h-full shrink-0">
                                        {post.thumbnailUrl ? (
                                            <img
                                                src={post.thumbnailUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-100" />
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col justify-between flex-1 bg-white">
                                        <div className="flex justify-between items-center text-xs text-zinc-500">
                                            <span>{getAuthorName(post.authorId)}</span>
                                            {post.tags && post.tags.length > 0 && (
                                                <Badge className="!text-[10px] !px-1.5 !py-0">{post.tags[0]}</Badge>
                                            )}
                                        </div>
                                        <h4 className="font-semibold text-zinc-900 line-clamp-2 m-0 group-hover:underline">{post.title}</h4>
                                        <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                                            Read Article on Author's Site <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </div>
                                    </div>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};
