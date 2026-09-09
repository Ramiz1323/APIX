const router = require('express').Router();
const { uploadImage, deleteImage } = require('./upload.controller.js');
const upload = require('../../core/middlewares/upload.middleware.js');
const { protect } = require('../../core/middlewares/auth.middleware.js');

// Routes protected by authentication
router.post('/image', protect, upload.single('image'), uploadImage);
router.delete('/:id', protect, deleteImage);
router.delete('/', protect, deleteImage);

module.exports = router;
