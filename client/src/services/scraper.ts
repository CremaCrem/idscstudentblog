import { apiClient } from './apiClient';

export interface ScraperResponse {
    title: string | null;
    thumbnailUrl: string | null;
    isScrapedFallback: boolean;
}

export const scraperService = {
    /**
     * Scrape Open Graph metadata from a URL
     */
    scrapeUrl: async (targetUrl: string): Promise<ScraperResponse> => {
        const response = await apiClient.post('/blogs/scrape', { targetUrl });
        return response.data.data;
    },
};
