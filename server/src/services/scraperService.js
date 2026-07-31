const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes Open Graph metadata (title, image) from a given URL.
 * Enforces a strict timeout to prevent thread blocking.
 *
 * @param {string} url - The target URL to scrape
 * @param {number} timeoutMs - Maximum execution time in milliseconds (default 4000)
 * @returns {Promise<{title: string|null, thumbnailUrl: string|null, isScrapedFallback: boolean}>}
 */
const scrapeMetadata = async (url, timeoutMs = 4000) => {
    try {
        const response = await axios.get(url, {
            timeout: timeoutMs,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Attempt to get Open Graph tags first, fallback to standard tags
        let title = $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() ||
            null;

        let thumbnailUrl = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            null;

        // Clean up title (remove extra whitespace/newlines)
        if (title) {
            title = title.replace(/\s+/g, ' ').trim();
        }

        // Validate URL format for thumbnailUrl if it exists
        if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
            // Resolve relative URLs using the base URL
            try {
                const urlObj = new URL(thumbnailUrl, url);
                thumbnailUrl = urlObj.href;
            } catch (e) {
                thumbnailUrl = null;
            }
        }

        return {
            title,
            thumbnailUrl,
            isScrapedFallback: false,
        };
    } catch (error) {
        console.error(`[Scraper] Failed to fetch metadata for ${url}: ${error.message}`);
        // Return fallback data when scraping fails or times out
        return {
            title: null,
            thumbnailUrl: null,
            isScrapedFallback: true,
        };
    }
};

module.exports = {
    scrapeMetadata,
};
