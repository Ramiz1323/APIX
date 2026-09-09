const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const uploadService = require('./upload.service.js');

const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'Please select an image file to upload');
    }

    const folder = req.body.folder || 'apix_uploads';
    const result = await uploadService.uploadImage(req.file.buffer, folder);

    res
        .status(201)
        .json(new ApiResponse(201, result, 'Image uploaded successfully'));
});

const deleteImage = asyncHandler(async (req, res) => {
    // Supports public_id passed via param (handling forward slashes in encoded param if any)
    const publicId = req.params.id || req.query.public_id;
    if (!publicId) {
        throw new ApiError(400, 'Public ID is required');
    }

    const result = await uploadService.deleteImage(publicId);

    res
        .status(200)
        .json(new ApiResponse(200, result, 'Image deleted successfully'));
});

module.exports = {
    uploadImage,
    deleteImage,
};
