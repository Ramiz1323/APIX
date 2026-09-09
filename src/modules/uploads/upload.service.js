const cloudinary = require('../../config/cloudinary.js');
const ApiError = require('../../utils/ApiError.js');

async function uploadImage(fileBuffer, folder = 'apix_uploads') {
    if (!fileBuffer) {
        throw new ApiError(400, 'No file buffer provided for upload');
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    return reject(
                        new ApiError(
                            500,
                            `Cloudinary upload failed: ${error.message || 'Unknown error'}`
                        )
                    );
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes,
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
}

async function deleteImage(publicId) {
    if (!publicId) {
        throw new ApiError(400, 'Public ID is required to delete an image');
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok' && result.result !== 'not found') {
        throw new ApiError(500, `Failed to delete image: ${result.result}`);
    }

    return {
        public_id: publicId,
        result: result.result,
        message: 'Image deleted from cloud storage successfully',
    };
}

module.exports = {
    uploadImage,
    deleteImage,
};
