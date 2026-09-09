const multer = require('multer');
const ApiError = require('../../utils/ApiError.js');

// Store file in memory buffer for streaming to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError(
                400,
                `Invalid file format: ${file.mimetype}. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed.`
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB max
    },
    fileFilter,
});

module.exports = upload;
