const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public profile route
router.get('/:username/profile', userController.getPublicProfile);

module.exports = router;
