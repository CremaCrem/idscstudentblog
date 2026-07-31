const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authGuard, authorizeRoles } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(authGuard);
router.use(authorizeRoles('admin'));

// Metrics
router.get('/metrics', adminController.getMetrics);

// Blog Management
router.get('/blogs', adminController.getAllBlogs);
router.patch('/blogs/:id/publish', adminController.togglePublishStatus);
router.delete('/blogs/:id', adminController.deleteBlog);

// Health Checks
router.post('/health-scan', adminController.triggerHealthScan);
router.post('/blogs/:id/health-check', adminController.checkSingleLinkHealth);

// User Verification Management
router.get('/users/pending', adminController.getPendingUsers);
router.patch('/users/:id/approve', adminController.approveUser);
router.patch('/users/:id/reject', adminController.rejectUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
