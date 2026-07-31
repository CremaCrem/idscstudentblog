const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authGuard } = require('../middleware/authMiddleware');

// Public routes (Feed)
router.get('/', blogController.getAllBlogs);
router.get('/featured', blogController.getFeaturedBlogs);

// Protected routes (require valid JWT)
router.use(authGuard);

router.get('/me', blogController.getMyBlogs);
router.post('/scrape', blogController.scrapeUrl);
router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
