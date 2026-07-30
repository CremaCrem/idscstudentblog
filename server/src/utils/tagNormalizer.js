/**
 * Normalizes a raw tag string into a standardized format.
 * - Trims leading/trailing whitespace
 * - Converts to lowercase
 * - Replaces multiple spaces with a single space
 * - Removes non-alphanumeric characters (except spaces and hyphens)
 * 
 * @param {string} rawTag - The input tag string (e.g., " Artificial  Intelligence! ")
 * @returns {string} The normalized tag (e.g., "artificial intelligence")
 */
const normalizeTag = (rawTag) => {
  if (!rawTag || typeof rawTag !== 'string') return '';
  
  return rawTag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except space and hyphen
    .replace(/\s+/g, ' '); // Collapse multiple spaces into one
};

module.exports = {
  normalizeTag
};
