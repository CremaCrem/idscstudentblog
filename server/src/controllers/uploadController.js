const imageService = require('../services/imageService');

exports.uploadThumbnail = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_FILE',
                    message: 'No file uploaded.'
                }
            });
        }

        // Multer file filter handles basic size and MIME checks, but just to be sure
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_FILE',
                    message: 'File is not an allowed image format (PNG, JPG, WEBP).'
                }
            });
        }

        // Convert and upload
        const result = await imageService.processAndUploadImage(req.file.buffer);

        res.status(200).json({
            success: true,
            data: result // { url, publicId }
        });
    } catch (error) {
        next(error);
    }
};
