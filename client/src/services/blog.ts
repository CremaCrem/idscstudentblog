import { apiClient } from './apiClient';

export interface BlogPost {
    _id: string;
    authorId: { _id: string, username: string } | string;
    targetUrl: string;
    title: string;
    thumbnailUrl: string;
    cloudinaryPublicId?: string;
    tags: string[];
    isPublished: boolean;
    isScrapedFallback: boolean;
    lastHealthCheckStatus: string;
    lastCheckedAt: string | null;
    httpStatusCode: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogData {
    targetUrl: string;
    title: string;
    thumbnailUrl?: string;
    cloudinaryPublicId?: string;
    tags?: string[];
    isPublished?: boolean;
}

export interface UpdateBlogData {
    title?: string;
    thumbnailUrl?: string;
    cloudinaryPublicId?: string;
    tags?: string[];
    isPublished?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export const blogService = {
    /**
     * Get published blogs (Feed) with optional pagination and filtering
     */
    getBlogs: async (params?: { tag?: string, page?: number, limit?: number }): Promise<PaginatedResponse<BlogPost>> => {
        const response = await apiClient.get('/blogs', { params });
        return {
            data: response.data.data,
            pagination: response.data.pagination
        };
    },

    /**
     * Get featured blogs (Hero section)
     */
    getFeaturedBlogs: async (): Promise<BlogPost[]> => {
        const response = await apiClient.get('/blogs/featured');
        return response.data.data;
    },

    getMyBlogs: async (): Promise<BlogPost[]> => {
        const response = await apiClient.get('/blogs/me');
        return response.data.data;
    },

    /**
     * Submit a new blog post
     */
    createBlog: async (data: CreateBlogData): Promise<BlogPost> => {
        const response = await apiClient.post('/blogs', data);
        return response.data.data;
    },

    /**
     * Update an existing blog post
     */
    updateBlog: async (id: string, data: Partial<BlogPost>): Promise<BlogPost> => {
        const response = await apiClient.put(`/blogs/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete a blog post
     */
    deleteBlog: async (id: string): Promise<void> => {
        await apiClient.delete(`/blogs/${id}`);
    },
};
