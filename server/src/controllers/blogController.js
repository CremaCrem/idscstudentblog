const BlogPost = require('../models/BlogPost');
const { scrapeMetadata } = require('../services/scraperService');
const tagService = require('../services/tagService');
const mongoose = require('mongoose');

// @desc    Get all published blogs (Feed)
// @route   GET /api/v1/blogs
// @access  Public
exports.getAllBlogs = async (req, res, next) => {
    try {
        const { tag, page = 1, limit = 12, dateFrom, dateTo } = req.query;
        
        const query = { isPublished: true };
        
        if (tag) {
            query.tags = tag.toLowerCase().trim();
        }

        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) {
                query.createdAt.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                query.createdAt.$lte = new Date(dateTo);
            }
        }

        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10))); // Cap limit at 50
        const skip = (pageNum - 1) * limitNum;

        const blogs = await BlogPost.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('authorId', 'username');

        const total = await BlogPost.countDocuments(query);

        res.status(200).json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get featured blogs (Hero section)
// @route   GET /api/v1/blogs/featured
// @access  Public
exports.getFeaturedBlogs = async (req, res, next) => {
    try {
        // Fetch top 3 most recent published posts for the hero/featured section
        const blogs = await BlogPost.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('authorId', 'username');

        res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get logged-in student's blogs (Dashboard)
// @route   GET /api/v1/blogs/me
// @access  Private
exports.getMyBlogs = async (req, res, next) => {
    try {
        const userId = req.user.userId || req.user.id;
        const blogs = await BlogPost.find({ authorId: userId })
            .sort({ createdAt: -1 })
            .populate('authorId', 'username');

        res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Scrape Open Graph metadata from URL
// @route   POST /api/v1/blogs/scrape
// @access  Private
exports.scrapeUrl = async (req, res, next) => {
    try {
        const { targetUrl } = req.body;

        if (!targetUrl || typeof targetUrl !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'BAD_REQUEST',
                    message: 'Please provide a valid target URL.',
                    timestamp: new Date().toISOString(),
                }
            });
        }

        // Basic URL validation
        try {
            new URL(targetUrl);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'BAD_REQUEST',
                    message: 'Invalid URL format.',
                    timestamp: new Date().toISOString(),
                }
            });
        }

        const metadata = await scrapeMetadata(targetUrl);

        res.status(200).json({
            success: true,
            data: metadata,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new blog post
// @route   POST /api/v1/blogs
// @access  Private
exports.createBlog = async (req, res, next) => {
    try {
        const { targetUrl, title, thumbnailUrl, cloudinaryPublicId, tags, isPublished } = req.body;

        if (!targetUrl || !title) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'BAD_REQUEST',
                    message: 'Please provide targetUrl and title.',
                    timestamp: new Date().toISOString(),
                }
            });
        }

        // Validate tags array
        let processedTags = [];
        if (tags && Array.isArray(tags)) {
            if (tags.length > 5) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'BAD_REQUEST',
                        message: 'A maximum of 5 tags is allowed.',
                        timestamp: new Date().toISOString(),
                    }
                });
            }
            // Sanitize and upsert tags to the Tag collection
            processedTags = await tagService.processPostTags(tags);
        }

        const blogPost = await BlogPost.create({
            authorId: req.user.userId || req.user.id,
            targetUrl,
            title,
            thumbnailUrl: thumbnailUrl || '',
            cloudinaryPublicId: cloudinaryPublicId || null,
            tags: processedTags,
            isPublished: isPublished !== undefined ? isPublished : true,
            isScrapedFallback: !thumbnailUrl || !title, // Simple heuristic for now
        });

        res.status(201).json({
            success: true,
            data: blogPost,
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: messages.join(', '),
                    timestamp: new Date().toISOString()
                }
            });
        }
        next(err);
    }
};

// @desc    Update a blog post
// @route   PUT /api/v1/blogs/:id
// @access  Private
exports.updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, thumbnailUrl, cloudinaryPublicId, tags, isPublished } = req.body;

        let blog = await BlogPost.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Blog post not found.',
                    timestamp: new Date().toISOString(),
                }
            });
        }

        // Ensure user owns the post or is admin
        const currentUserId = req.user.userId || req.user.id;
        if (blog.authorId.toString() !== currentUserId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Not authorized to update this post.',
                    timestamp: new Date().toISOString(),
                }
            });
        }

        // Process updates
        if (title) blog.title = title;
        if (thumbnailUrl !== undefined) blog.thumbnailUrl = thumbnailUrl;
        if (cloudinaryPublicId !== undefined) {
            // If the thumbnail is replaced, clean up the old one
            if (blog.cloudinaryPublicId && blog.cloudinaryPublicId !== cloudinaryPublicId) {
                try {
                    const imageService = require('../services/imageService');
                    await imageService.deleteImage(blog.cloudinaryPublicId);
                } catch (err) {
                    console.error('Failed to delete old Cloudinary asset on update:', err);
                }
            }
            blog.cloudinaryPublicId = cloudinaryPublicId;
        }
        if (isPublished !== undefined) blog.isPublished = isPublished;

        if (tags && Array.isArray(tags)) {
            if (tags.length > 5) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'BAD_REQUEST',
                        message: 'A maximum of 5 tags is allowed.',
                        timestamp: new Date().toISOString(),
                    }
                });
            }
            blog.tags = await tagService.processPostTags(tags);
        }

        await blog.save();

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/v1/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        const blog = await BlogPost.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Blog post not found.',
                    timestamp: new Date().toISOString(),
                }
            });
        }

        // Ensure user owns the post or is admin
        const currentUserId = req.user.userId || req.user.id;
        if (blog.authorId.toString() !== currentUserId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Not authorized to delete this post.',
                    timestamp: new Date().toISOString(),
                }
            });
        }

        await BlogPost.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
