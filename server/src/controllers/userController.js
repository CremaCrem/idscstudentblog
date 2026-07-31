const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

/**
 * @desc    Get public profile for a user along with their published blogs
 * @route   GET /api/v1/users/:username/profile
 * @access  Public
 */
exports.getPublicProfile = async (req, res, next) => {
    try {
        const { username } = req.params;

        // Find the user by username (case-insensitive)
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
            .select('username createdAt role'); // Only return safe public fields

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'User not found.',
                    timestamp: new Date().toISOString(),
                }
            });
        }

        // Fetch their published blogs
        const blogs = await BlogPost.find({ 
            authorId: user._id,
            isPublished: true
        })
        .sort({ createdAt: -1 })
        .populate('authorId', 'username');

        res.status(200).json({
            success: true,
            data: {
                profile: user,
                blogs: blogs
            }
        });
    } catch (err) {
        next(err);
    }
};
