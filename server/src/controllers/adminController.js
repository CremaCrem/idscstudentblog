const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const healthCheckService = require('../services/healthCheckService');

/**
 * Get system metrics for admin dashboard
 */
const getMetrics = async (req, res) => {
    try {
        const totalBlogs = await BlogPost.countDocuments({});
        const totalStudents = await User.countDocuments({ role: 'student' });
        const healthyLinks = await BlogPost.countDocuments({ lastHealthCheckStatus: 'healthy' });
        const brokenLinks = await BlogPost.countDocuments({ lastHealthCheckStatus: 'broken' });

        res.json({
            success: true,
            data: {
                totalBlogs,
                totalStudents,
                healthyLinks,
                brokenLinks
            }
        });
    } catch (error) {
        console.error('Error fetching admin metrics:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch metrics' } });
    }
};

/**
 * Get all blogs (including unpublished) with pagination
 */
const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const blogs = await BlogPost.find({})
            .populate('authorId', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await BlogPost.countDocuments({});

        res.json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching admin blogs:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch blogs' } });
    }
};

/**
 * Toggle publication status
 */
const togglePublishStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await BlogPost.findById(id);
        
        if (!blog) {
            return res.status(404).json({ success: false, error: { message: 'Blog not found' } });
        }

        blog.isPublished = !blog.isPublished;
        await blog.save();

        // Populate authorId before sending response so the frontend UI doesn't fallback to "Unknown"
        const populatedBlog = await BlogPost.findById(blog._id).populate('authorId', 'username');

        res.json({ success: true, data: populatedBlog });
    } catch (error) {
        console.error('Error toggling publish status:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to toggle status' } });
    }
};

/**
 * Trigger background health scan
 */
const triggerHealthScan = async (req, res) => {
    try {
        // Run asynchronously, respond immediately to prevent UI blocking
        healthCheckService.runBatchHealthScan().catch(err => {
            console.error('Batch health scan failed:', err);
        });

        res.json({
            success: true,
            message: 'Health scan started in the background.'
        });
    } catch (error) {
        console.error('Error triggering health scan:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to trigger scan' } });
    }
};

/**
 * Check single link health
 */
const checkSingleLinkHealth = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await BlogPost.findById(id);
        
        if (!blog) {
            return res.status(404).json({ success: false, error: { message: 'Blog not found' } });
        }

        const updatedBlog = await healthCheckService.scanSingleLink(blog);

        // Populate authorId before sending response so the frontend UI doesn't fallback to "Unknown"
        const populatedBlog = await BlogPost.findById(updatedBlog._id).populate('authorId', 'username');

        res.json({ success: true, data: populatedBlog });
    } catch (error) {
        console.error('Error checking single link:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to check link' } });
    }
};

/**
 * Delete a blog post
 */
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await BlogPost.findByIdAndDelete(id);
        
        if (!blog) {
            return res.status(404).json({ success: false, error: { message: 'Blog not found' } });
        }

        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to delete blog' } });
    }
};

/**
 * Get all pending student registrations
 */
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ verificationStatus: 'pending' })
            .select('-password')
            .sort({ createdAt: 1 }); // Oldest first (FIFO)

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching pending users:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch pending users' } });
    }
};

/**
 * Approve a student registration
 */
const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, error: { message: 'User not found' } });
        }

        user.verificationStatus = 'approved';
        user.verifiedBy = req.user.userId;
        user.verifiedAt = new Date();
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ success: true, data: userResponse });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to approve user' } });
    }
};

/**
 * Reject a student registration
 */
const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, error: { message: 'User not found' } });
        }

        user.verificationStatus = 'rejected';
        if (rejectionReason) {
            user.rejectionReason = rejectionReason;
        }
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ success: true, data: userResponse });
    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to reject user' } });
    }
};

/**
 * Delete a user account (e.g. for rejected registrations)
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ success: false, error: { message: 'User not found' } });
        }

        res.json({ success: true, message: 'User account deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to delete user' } });
    }
};

/**
 * Get all users with their blog post counts
 */
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Base match to optionally filter by status or search
        const match = { role: 'student' };
        if (req.query.status) {
            match.verificationStatus = req.query.status;
        }
        if (req.query.search) {
            match.$or = [
                { fullName: { $regex: req.query.search, $options: 'i' } },
                { username: { $regex: req.query.search, $options: 'i' } },
                { studentId: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const aggregationPipeline = [
            { $match: match },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'blogposts',
                    localField: '_id',
                    foreignField: 'authorId',
                    as: 'blogs'
                }
            },
            {
                $addFields: {
                    blogCount: { $size: '$blogs' }
                }
            },
            {
                $project: {
                    password: 0,
                    blogs: 0 // We don't need the actual blogs here, just the count
                }
            }
        ];

        const users = await User.aggregate(aggregationPipeline);
        const total = await User.countDocuments(match);

        res.json({
            success: true,
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch users' } });
    }
};

/**
 * Get a single user's profile and their blogs
 */
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: { message: 'User not found' } });
        }

        const blogs = await BlogPost.find({ authorId: id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                user,
                blogs
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, error: { message: 'Failed to fetch user profile' } });
    }
};

module.exports = {
    getMetrics,
    getAllBlogs,
    togglePublishStatus,
    triggerHealthScan,
    checkSingleLinkHealth,
    deleteBlog,
    getPendingUsers,
    approveUser,
    rejectUser,
    deleteUser,
    getUsers,
    getUserProfile
};
