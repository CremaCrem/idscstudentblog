import { apiClient } from './apiClient';
import type { BlogPost } from './blog';

export interface PublicProfile {
    username: string;
    createdAt: string;
    role: string;
}

export interface ProfileResponse {
    profile: PublicProfile;
    blogs: BlogPost[];
}

export const userService = {
    getPublicProfile: async (username: string): Promise<ProfileResponse> => {
        const response = await apiClient.get(`/users/${username}/profile`);
        return response.data.data;
    }
};
