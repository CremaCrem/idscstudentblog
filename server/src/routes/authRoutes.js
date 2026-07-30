const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authGuard } = require('../middleware/authMiddleware');

// Public authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected session route
router.get('/me', authGuard, authController.getMe);

module.exports = router;
