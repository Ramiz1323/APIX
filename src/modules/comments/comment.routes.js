const router = require('express').Router();
const {
    getAllComments,
    getCommentById,
    createComment,
    deleteComment,
} = require('./comment.controller.js');
const { validate } = require('../../core/middlewares/validate.middleware.js');
const {
    createCommentSchema,
    commentIdParamSchema,
} = require('./comment.validator.js');
const { protect } = require('../../core/middlewares/auth.middleware.js');

// Public Routes
router.get('/', getAllComments);
router.get('/:id', validate(commentIdParamSchema), getCommentById);

// Protected Routes
router.post('/', protect, validate(createCommentSchema), createComment);
router.delete('/:id', protect, validate(commentIdParamSchema), deleteComment);

module.exports = router;
