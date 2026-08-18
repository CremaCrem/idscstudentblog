import { apiClient } from './apiClient';
import type { BlogPost } from './blog';

export interface AdminMetrics {
    totalBlogs: number;
    totalStudents: number;
    healthyLinks: number;
    brokenLinks: number;
}

export interface AdminPaginatedBlogs {
    data: BlogPost[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface StudentUser {
    _id: string;
    fullName: string;
    studentId: string;
    username: string;
    email: string;
    role: string;
    verificationStatus: string;
    createdAt: string;
    verifiedAt?: string;
    blogCount?: number;
}

export interface AdminPaginatedUsers {
    data: StudentUser[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface StudentProfileData {
    user: StudentUser;
    blogs: BlogPost[];
}

export const adminService = {
    getMetrics: async (): Promise<AdminMetrics> => {
        const response = await apiClient.get('/admin/metrics');
        return response.data.data;
    },

    getBlogs: async (params?: { page?: number, limit?: number }): Promise<AdminPaginatedBlogs> => {
        const response = await apiClient.get('/admin/blogs', { params });
        return {
            data: response.data.data,
            pagination: response.data.pagination
        };
    },

    togglePublish: async (id: string): Promise<BlogPost> => {
        const response = await apiClient.patch(`/admin/blogs/${id}/publish`);
        return response.data.data;
    },

    deleteBlog: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/blogs/${id}`);
    },

    runHealthScan: async (): Promise<void> => {
        await apiClient.post('/admin/health-scan');
    },

    checkSingleLink: async (id: string): Promise<BlogPost> => {
        const response = await apiClient.post(`/admin/blogs/${id}/health-check`);
        return response.data.data;
    },

    getPendingUsers: async (): Promise<any[]> => {
        const response = await apiClient.get('/admin/users/pending');
        return response.data.data;
    },

    approveUser: async (id: string): Promise<any> => {
        const response = await apiClient.patch(`/admin/users/${id}/approve`);
        return response.data.data;
    },

    rejectUser: async (id: string, rejectionReason?: string): Promise<any> => {
        const response = await apiClient.patch(`/admin/users/${id}/reject`, { rejectionReason });
        return response.data.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/users/${id}`);
    },

    getUsers: async (params?: { page?: number, limit?: number, search?: string, status?: string }): Promise<AdminPaginatedUsers> => {
        const response = await apiClient.get('/admin/users', { params });
        return {
            data: response.data.data,
            pagination: response.data.pagination
        };
    },

    getUserProfile: async (id: string): Promise<StudentProfileData> => {
        const response = await apiClient.get(`/admin/users/${id}`);
        return response.data.data;
    }
};
