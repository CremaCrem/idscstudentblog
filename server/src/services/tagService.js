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
   * Fetches the most frequently used tags from active, published posts.
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async getPopularTags(limit = 10) {
    const mongoose = require('mongoose');
    
    // 1. Aggregate top normalized tags from published posts only
    const popularAggregation = await mongoose.model('BlogPost').aggregate([
      { $match: { isPublished: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    if (popularAggregation.length === 0) return [];

    const topNormalized = popularAggregation.map(ag => ag._id);
    
    // 2. Fetch the corresponding Tag entities to get properly cased 'name'
    const tags = await Tag.find({ normalizedName: { $in: topNormalized } });
    
    // 3. Map the names back in the sorted order of popularAggregation
    const nameMap = new Map();
    tags.forEach(t => nameMap.set(t.normalizedName, t.name));

    return topNormalized.map(norm => nameMap.get(norm) || norm);
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
