import type { TagSuggestionResponse } from '../types/tag';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1';

export const tagApi = {
  /**
   * Fetches autocomplete suggestions for a given query
   */
  getSuggestions: async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];
    
    try {
      const response = await fetch(`${API_BASE_URL}/tags/suggestions?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tag suggestions');
      }

      const data: TagSuggestionResponse = await response.json();
      return data.data;
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
      const response = await fetch(`${API_BASE_URL}/tags/popular?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch popular tags');
      }

      const data: TagSuggestionResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      return [];
    }
  }
};
