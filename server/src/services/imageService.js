const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Converts an image buffer to WebP and uploads it to Cloudinary.
 * @param {Buffer} buffer The file buffer from multer.
 * @returns {Promise<{url: string, publicId: string}>} The Cloudinary URL and public ID.
 */
exports.processAndUploadImage = async (buffer) => {
    try {
        // Convert image to WebP using sharp
        const webpBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer();

        // Upload to Cloudinary via stream
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'idsc_thumbnails',
                    format: 'webp',
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            );
            uploadStream.end(webpBuffer);
        });
    } catch (error) {
        console.error('Error processing or uploading image:', error);
        throw new Error('Image processing/upload failed');
    }
};

/**
 * Deletes an image from Cloudinary using its public ID.
 * @param {string} publicId The Cloudinary public ID.
 */
exports.deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
        // We do not throw an error here to prevent disrupting main operations (e.g. if the asset is already missing)
    }
};
