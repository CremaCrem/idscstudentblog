import { apiClient } from './apiClient';

export interface UploadResponse {
    url: string;
    publicId: string;
}

export const uploadService = {
    /**
     * Uploads an image file to be used as a thumbnail.
     * Validates on the backend, converts to WebP, and stores via Cloudinary.
     * @param file The image File object to upload
     */
    uploadThumbnail: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/upload/thumbnail', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },
};
