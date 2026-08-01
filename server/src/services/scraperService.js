const axios = require('axios');
const cheerio = require('cheerio');
const { validateUrlForSsrf } = require('../utils/ssrfProtect');

// ── Constants ─────────────────────────────────────────────────────────────────

const SCRAPER_TIMEOUT_MS = 5000; // Per-request timeout (ms)
const MAX_REDIRECTS      = 5;    // Maximum redirect hops to follow
const SCRAPER_HEADERS    = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept':     'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
};

// ── SSRF-safe fetch ───────────────────────────────────────────────────────────

/**
 * Performs an HTTP GET while manually following redirects.
 *
 * Before EVERY request — including each redirect hop — the target URL is
 * validated against the SSRF blocklist (protocol check + DNS resolution +
 * private-IP check). This prevents DNS-rebinding and open-redirect attacks
 * from routing a public-looking hostname to an internal address on a later hop.
 *
 * @param {string} url  Starting URL (already SSRF-validated by the caller)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
async function safeFetch(url) {
    let currentUrl = url;

    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
        // Validate before every outbound request (including redirect targets)
        await validateUrlForSsrf(currentUrl);

        const response = await axios.get(currentUrl, {
            timeout:        SCRAPER_TIMEOUT_MS,
            maxRedirects:   0,            // Never follow redirects automatically
            validateStatus: () => true,   // Treat all status codes as resolved (no throws)
            headers:        SCRAPER_HEADERS,
        });

        const { status } = response;

        // 2xx — success, return to caller
        if (status >= 200 && status < 300) return response;

        // 3xx — redirect: extract Location, resolve relative URLs, re-validate next hop
        if (status >= 300 && status < 400) {
            const location = response.headers['location'];
            if (!location) {
                throw new Error(`Redirect response (${status}) from '${currentUrl}' had no Location header.`);
            }
            // Resolve relative redirects (e.g. /new-path) against the current URL
            currentUrl = new URL(location, currentUrl).href;
            continue;
        }

        // 4xx / 5xx — return as-is; the caller decides how to handle it
        return response;
    }

    throw new Error('Too many redirects: the URL exceeded the maximum allowed redirect chain.');
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Scrapes Open Graph metadata (title, image) from a given URL.
 *
 * SSRF protection: every request in the redirect chain is validated before it
 * is made — protocol-checked and DNS-resolved against a private-IP blocklist.
 *
 * Error handling:
 *  - SSRF / bad-request errors are re-thrown so the controller can return a
 *    proper 4xx response to the client.
 *  - Genuine network, timeout, or parse failures return fallback data so the
 *    UI can still render a manual-entry form.
 *
 * @param {string} url - The target URL to scrape
 * @returns {Promise<{title: string|null, thumbnailUrl: string|null, isScrapedFallback: boolean}>}
 */
const scrapeMetadata = async (url) => {
    try {
        const response = await safeFetch(url);
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
        // Re-throw SSRF / validation errors — controller returns 400 to the client
        if (error.code === 'SSRF_BLOCKED' || error.code === 'BAD_REQUEST') throw error;

        // Genuine network / timeout / parse errors → return graceful fallback
        console.error(`[Scraper] Failed to fetch metadata for ${url}: ${error.message}`);
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
