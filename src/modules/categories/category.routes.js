const router = require('express').Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('./category.controller.js');
const { validate } = require('../../core/middlewares/validate.middleware.js');
const {
    createCategorySchema,
    updateCategorySchema,
    categoryIdParamSchema,
} = require('./category.validator.js');
const {
    protect,
    authorize,
} = require('../../core/middlewares/auth.middleware.js');

// Public Routes
router.get('/', getAllCategories);
router.get('/:id', validate(categoryIdParamSchema), getCategoryById);

// Admin Protected Routes
router.post(
    '/',
    protect,
    authorize('ADMIN'),
    validate(createCategorySchema),
    createCategory
);
router.patch(
    '/:id',
    protect,
    authorize('ADMIN'),
    validate(updateCategorySchema),
    updateCategory
);
router.delete(
    '/:id',
    protect,
    authorize('ADMIN'),
    validate(categoryIdParamSchema),
    deleteCategory
);

module.exports = router;
