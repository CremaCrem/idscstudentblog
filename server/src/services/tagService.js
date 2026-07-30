const Tag = require('../models/Tag');
const { normalizeTag } = require('../utils/tagNormalizer');

class TagService {
  /**
   * Fetches tag suggestions based on a partial query match.
   * @param {string} query 
   * @param {number} limit 
   * @returns {Promise<Array>} Array of tag names
   */
  async getSuggestions(query, limit = 5) {
    if (!query) return [];
    
    const normalizedQuery = normalizeTag(query);
    if (!normalizedQuery) return [];

    // Use regex for partial matching on normalized name
    // (A text index is great for full-word matching, but regex is better for type-ahead partial autocomplete)
    const regex = new RegExp(`^${normalizedQuery}`, 'i');
    
    const tags = await Tag.find({ normalizedName: regex })
      .sort({ usageCount: -1 })
      .limit(limit)
      .select('name normalizedName usageCount -_id');

    return tags.map(t => t.name);
  }

  /**
   * Fetches the most frequently used tags.
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async getPopularTags(limit = 10) {
    const tags = await Tag.find({ usageCount: { $gt: 0 } })
      .sort({ usageCount: -1 })
      .limit(limit)
      .select('name normalizedName usageCount -_id');

    return tags.map(t => t.name);
  }

  /**
   * Processes raw tags from a blog submission: normalizes, dedupes, and updates usage counts.
   * (This is an internal service method meant to be called when a Blog Post is created)
   * @param {string[]} rawTags 
   * @returns {Promise<string[]>} Array of normalized tag strings to save on the BlogPost
   */
  async processPostTags(rawTags) {
    if (!Array.isArray(rawTags)) return [];

    // Normalize and deduplicate
    const normalizedMap = new Map();
    rawTags.forEach(rawTag => {
      const norm = normalizeTag(rawTag);
      if (norm) {
        // Keep the original display casing for the first occurrence
        if (!normalizedMap.has(norm)) {
          normalizedMap.set(norm, rawTag.trim());
        }
      }
    });

    const normalizedKeys = Array.from(normalizedMap.keys());
    if (normalizedKeys.length === 0) return [];

    // Find existing tags and create missing ones concurrently using bulkWrite
    const bulkOps = normalizedKeys.map(norm => ({
      updateOne: {
        filter: { normalizedName: norm },
        update: {
          $setOnInsert: { name: normalizedMap.get(norm) },
          $inc: { usageCount: 1 }
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await Tag.bulkWrite(bulkOps);
    }

    return normalizedKeys;
  }
}

module.exports = new TagService();
