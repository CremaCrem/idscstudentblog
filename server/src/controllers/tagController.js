const tagService = require('../services/tagService');

/**
 * @desc    Get tag autocomplete suggestions based on query
 * @route   GET /api/v1/tags/suggestions?q=string
 * @access  Public
 */
exports.getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const suggestions = await tagService.getSuggestions(q);
    
    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get most popular tags
 * @route   GET /api/v1/tags/popular?limit=number
 * @access  Public
 */
exports.getPopularTags = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const tags = await tagService.getPopularTags(limit);
    
    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    next(error);
  }
};
