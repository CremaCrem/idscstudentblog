import React, { useState, useEffect } from 'react';
import { TagFilterBar } from '../components/feed/TagFilterBar';
import { DateFilterBar, type DateRangeType } from '../components/feed/DateFilterBar';
import { InfiniteScrollSentinel } from '../components/ui/InfiniteScrollSentinel';
import { HeroFeaturedCard } from '../components/feed/HeroFeaturedCard';
import { BlogGridCard } from '../components/feed/BlogGridCard';
import { blogService, type BlogPost } from '../services/blog';
import { tagApi } from '../services/tagApi';
import { useSlowRequestTimer } from '../hooks/useSlowRequestTimer';
import { ServerStatusBanner } from '../components/ui/ServerStatusBanner';

export const HomePage: React.FC = () => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRangeType>('All Time');
    const [dateRangeValues, setDateRangeValues] = useState<{ from: string | null, to: string | null }>({ from: null, to: null });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
    const [gridPosts, setGridPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const showSlowBanner = useSlowRequestTimer(isLoading, 3000);

    // Fetch dynamic popular tags on mount
    useEffect(() => {
        tagApi.getPopularTags().then(setAvailableTags).catch(console.error);
    }, []);

    // Fetch feed data
    useEffect(() => {
        const fetchFeedData = async () => {
            const isInitialLoad = page === 1;
            if (isInitialLoad) {
                setIsLoading(true);
            } else {
                setIsFetchingMore(true);
            }
            setError(null);

            try {
                let currentFeatured: BlogPost[] = [];
                // Only fetch featured posts on initial load with no filters
                if (isInitialLoad && !selectedTag && dateRange === 'All Time') {
                    currentFeatured = await blogService.getFeaturedBlogs();
                    setFeaturedPosts(currentFeatured);
                } else if (isInitialLoad) {
                    // Hide hero section when filtering
                    setFeaturedPosts([]);
                }

                // Fetch grid posts with filtering and pagination
                const params = {
                    tag: selectedTag || undefined,
                    dateFrom: dateRangeValues.from || undefined,
                    dateTo: dateRangeValues.to || undefined,
                    page,
                    limit: 12
                };
                
                const blogsResponse = await blogService.getBlogs(params);
                let fetchedPosts = blogsResponse.data;

                // Remove duplicates from featured on first page
                if (isInitialLoad && !selectedTag && dateRange === 'All Time' && currentFeatured.length > 0) {
                    const featuredIds = new Set(currentFeatured.map(p => p._id));
                    fetchedPosts = fetchedPosts.filter(p => !featuredIds.has(p._id));
                }

                if (isInitialLoad) {
                    setGridPosts(fetchedPosts);
                } else {
                    setGridPosts(prev => [...prev, ...fetchedPosts]);
                }

                setHasMore(blogsResponse.pagination.page < blogsResponse.pagination.totalPages);

            } catch (err: any) {
                console.error("Failed to fetch feed data", err);
                setError("Unable to load the blog feed. Please try again later.");
            } finally {
                setIsLoading(false);
                setIsFetchingMore(false);
            }
        };

        fetchFeedData();
    }, [selectedTag, dateRangeValues, page, dateRange]);

    const handleTagChange = (tag: string | null) => {
        setSelectedTag(tag);
        setPage(1);
    };

    const handleDateRangeChange = (rangeType: DateRangeType, dateFrom: string | null, dateTo: string | null) => {
        setDateRange(rangeType);
        setDateRangeValues({ from: dateFrom, to: dateTo });
        setPage(1);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <header className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-5xl font-bold font-display text-zinc-900 tracking-tight">IDSC Pulse</h1>
                <p className="text-lg max-w-2xl mx-auto text-zinc-600 mt-4">Discover articles, capstone write-ups, and IT research published by students of Infotech Development Systems College – Ligao City, Albay.</p>
            </header>

            <TagFilterBar
                tags={availableTags}
                selectedTag={selectedTag}
                onSelectTag={handleTagChange}
            />

            <DateFilterBar
                activeRange={dateRange}
                onSelectDateRange={handleDateRangeChange}
            />

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center mb-8">
                    {error}
                </div>
            )}

            {isLoading ? (
                // Loading Skeleton State
                <div className="animate-pulse">
                    {showSlowBanner && <ServerStatusBanner />}
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
                                {selectedTag || dateRange !== 'All Time' ? (
                                    <button
                                        onClick={() => {
                                            handleTagChange(null);
                                            handleDateRangeChange('All Time', null, null);
                                        }}
                                        className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                ) : null}
                            </div>
                        )}
                        
                        {gridPosts.length > 0 && (
                            <InfiniteScrollSentinel
                                hasMore={hasMore}
                                isFetchingMore={isFetchingMore}
                                onIntersect={() => setPage(prev => prev + 1)}
                            />
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

