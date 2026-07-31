const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { authGuard, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new Error('File is not an allowed image format (PNG, JPG, WEBP).');
            error.statusCode = 400;
            error.code = 'INVALID_FILE';
            cb(error, false);
        }
    }
});

// POST /api/v1/upload/thumbnail
router.post(
    '/thumbnail',
    authGuard,
    authorizeRoles('student', 'admin'),
    upload.single('file'),
    uploadController.uploadThumbnail
);

module.exports = router;
