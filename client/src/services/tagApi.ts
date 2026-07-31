import type { TagSuggestionResponse } from '../types/tag';
import { apiClient } from './apiClient';

export const tagApi = {
  /**
   * Fetches autocomplete suggestions for a given query
   */
  getSuggestions: async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];
    
    try {
      const response = await apiClient.get<TagSuggestionResponse>(`/tags/suggestions`, {
        params: { q: query }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  },

  /**
   * Fetches popular tags
   */
  getPopularTags: async (limit: number = 10): Promise<string[]> => {
    try {
      const response = await apiClient.get<TagSuggestionResponse>(`/tags/popular`, {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      return [];
    }
  }
};
