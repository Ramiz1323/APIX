const router = require('express').Router();
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} = require('./post.controller.js');
const { validate } = require('../../core/middlewares/validate.middleware.js');
const {
    createPostSchema,
    updatePostSchema,
    postIdParamSchema,
} = require('./post.validator.js');
const { protect } = require('../../core/middlewares/auth.middleware.js');

// Public Routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected Author/Admin Routes
router.post('/', protect, validate(createPostSchema), createPost);
router.patch('/:id', protect, validate(updatePostSchema), updatePost);
router.delete('/:id', protect, validate(postIdParamSchema), deletePost);

module.exports = router;
