import React, { useState, useEffect } from 'react';
import { TagFilterBar } from '../components/feed/TagFilterBar';
import { HeroFeaturedCard } from '../components/feed/HeroFeaturedCard';
import { BlogGridCard } from '../components/feed/BlogGridCard';
import { blogService, type BlogPost } from '../services/blog';


// Available tags based on previous wireframes/requirements
const AVAILABLE_TAGS = [
    "artificial intelligence",
    "information technology",
    "agriculture",
    "design",
    "software engineering",
    "cybersecurity",
    "machine learning",
    "robotics"
];

export const HomePage: React.FC = () => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
    const [gridPosts, setGridPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedData = async () => {
            setIsLoading(true);
            setError(null);
            try {
            let currentFeatured: BlogPost[] = [];
            // If there's no tag selected, fetch featured posts for the hero section
            if (!selectedTag) {
                currentFeatured = await blogService.getFeaturedBlogs();
                setFeaturedPosts(currentFeatured);
            } else {
                // Hide hero section when filtering by tag
                setFeaturedPosts([]);
            }

            // Fetch grid posts with optional tag filtering
            const params = selectedTag ? { tag: selectedTag } : {};
            const blogsResponse = await blogService.getBlogs(params);

            // If we are showing featured posts, don't duplicate them in the grid
            if (!selectedTag && blogsResponse.data && currentFeatured.length > 0) {
                // Filter out featured posts from the main grid
                const featuredIds = new Set(currentFeatured.map(p => p._id));
                    setGridPosts(blogsResponse.data.filter(p => !featuredIds.has(p._id)));
                } else {
                    setGridPosts(blogsResponse.data);
                }

            } catch (err: any) {
                console.error("Failed to fetch feed data", err);
                setError("Unable to load the blog feed. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedData();
    }, [selectedTag]);

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <header className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-5xl font-bold font-display text-zinc-900 tracking-tight">IDSC Student Showcase</h1>
                <p className="text-lg max-w-2xl mx-auto text-zinc-600 mt-4">Discover articles, capstone write-ups, and IT research published by students of Infotech Development Systems Colleges – Ligao City, Albay.</p>
            </header>

            <TagFilterBar
                tags={AVAILABLE_TAGS}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
            />

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center mb-8">
                    {error}
                </div>
            )}

            {isLoading ? (
                // Loading Skeleton State
                <div className="animate-pulse">
                    {!selectedTag && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                            <div className="lg:col-span-2 h-[500px] bg-zinc-200 rounded-2xl"></div>
                            <div className="flex flex-col gap-6">
                                <div className="h-6 w-32 bg-zinc-200 rounded mb-4"></div>
                                <div className="h-[120px] bg-zinc-200 rounded-2xl"></div>
                                <div className="h-[120px] bg-zinc-200 rounded-2xl"></div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[320px] bg-zinc-200 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Hero Section (Only shown when not filtering by tag) */}
                    {!selectedTag && featuredPosts.length > 0 && (
                        <HeroFeaturedCard featuredPosts={featuredPosts} />
                    )}

                    {/* 3-Column Content Grid */}
                    <section className="mb-12">
                        {gridPosts.length > 0 ? (
                            <>
                                <h3 className="text-2xl font-semibold text-zinc-900 mb-6 mt-0">
                                    {selectedTag ? `Posts tagged with "${selectedTag}"` : 'More from the community'}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {gridPosts.map(post => (
                                        <BlogGridCard key={post._id} post={post} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-24 bg-stone-50 border border-zinc-200 rounded-2xl border-dashed">
                                <h3 className="text-xl font-semibold text-zinc-900 mb-2">No posts found</h3>
                                <p className="text-zinc-500 mb-6">There are no published blog posts for this category yet.</p>
                                {selectedTag && (
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
                                    >
                                        Clear Filter
                                    </button>
                                )}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

