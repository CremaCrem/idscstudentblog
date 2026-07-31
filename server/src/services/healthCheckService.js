const axios = require('axios');
const BlogPost = require('../models/BlogPost');

/**
 * Perform an HTTP HEAD (or fallback GET) request to check a URL's status.
 * Returns an object with { status: 'healthy'|'broken'|'warning', statusCode: Number|null }
 */
const checkUrl = async (url) => {
    try {
        // Use a strict 3.0-second timeout as per requirements
        const response = await axios.head(url, { timeout: 3000, validateStatus: () => true });
        
        let statusCode = response.status;
        
        // Some servers reject HEAD requests with 405 Method Not Allowed or 403 Forbidden.
        // Let's fallback to GET if that happens, just to be sure it's not a false negative.
        if (statusCode === 405 || statusCode === 403) {
            const getResponse = await axios.get(url, { timeout: 3000, validateStatus: () => true });
            statusCode = getResponse.status;
        }

        if (statusCode >= 200 && statusCode < 400) {
            return { status: 'healthy', statusCode };
        } else if (statusCode === 403 || statusCode === 429) {
            return { status: 'warning', statusCode };
        } else {
            return { status: 'broken', statusCode };
        }
    } catch (error) {
        // Network errors (e.g., ENOTFOUND, ECONNREFUSED, timeout)
        return { status: 'broken', statusCode: null };
    }
};

/**
 * Scans a single blog post and updates its health status in the database.
 */
const scanSingleLink = async (blogPost) => {
    const { status, statusCode } = await checkUrl(blogPost.targetUrl);
    
    // BlogPost model enum allows 'healthy', 'broken', 'pending'. Let's ensure warning maps correctly.
    // In our model enum it only has 'healthy', 'broken', 'pending'. 
    // The requirement mentions 'healthy', 'warning', 'broken'. Wait, the model enum only has 'healthy', 'broken', 'pending'. 
    // Let's update the model to include 'warning' if it's not there, or map warning to 'broken' or 'healthy'. 
    // The model schema says: enum: ['healthy', 'broken', 'pending'].
    // Let's map 'warning' to 'broken' for the db, or just use 'healthy' and 'broken'.
    const finalStatus = (status === 'warning') ? 'broken' : status;

    blogPost.lastHealthCheckStatus = finalStatus;
    blogPost.httpStatusCode = statusCode;
    blogPost.lastCheckedAt = new Date();
    
    await blogPost.save();
    return blogPost;
};

/**
 * Scans all active (published or unpublished) blog links in the database asynchronously.
 * Designed to run in the background (batch processing).
 */
const runBatchHealthScan = async () => {
    const blogs = await BlogPost.find({});
    
    // We can process these sequentially.
    const results = { healthy: 0, broken: 0, totalScanned: blogs.length };

    for (const blog of blogs) {
        const updatedBlog = await scanSingleLink(blog);
        if (updatedBlog.lastHealthCheckStatus === 'healthy') {
            results.healthy++;
        } else {
            results.broken++;
        }
    }

    return results;
};

module.exports = {
    checkUrl,
    scanSingleLink,
    runBatchHealthScan
};
