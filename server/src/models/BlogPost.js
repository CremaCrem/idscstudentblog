const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
    {
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        targetUrl: {
            type: String,
            required: [true, 'Target URL is required'],
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters long'],
            maxlength: [150, 'Title cannot exceed 150 characters'],
        },
        thumbnailUrl: {
            type: String,
            trim: true,
            default: '',
        },
        tags: [
            {
                type: String,
                lowercase: true,
                trim: true,
            },
        ],
        isPublished: {
            type: Boolean,
            default: true,
        },
        isScrapedFallback: {
            type: Boolean,
            default: false,
        },
        lastHealthCheckStatus: {
            type: String,
            enum: ['healthy', 'broken', 'pending'],
            default: 'pending',
        },
        lastCheckedAt: {
            type: Date,
            default: null,
        },
        httpStatusCode: {
            type: Number,
            default: null,
        },
        cloudinaryPublicId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Post-delete hook to clean up associated Cloudinary asset
blogPostSchema.post('findOneAndDelete', async function(doc) {
    if (doc && doc.cloudinaryPublicId) {
        try {
            const imageService = require('../services/imageService');
            await imageService.deleteImage(doc.cloudinaryPublicId);
        } catch (err) {
            console.error('Failed to delete Cloudinary asset for deleted post:', err);
        }
    }
});

// Indexes for fast querying in feed
blogPostSchema.index({ isPublished: 1, tags: 1 });
blogPostSchema.index({ authorId: 1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
