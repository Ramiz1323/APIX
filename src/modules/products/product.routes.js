const router = require('express').Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('./product.controller.js');
const { validate } = require('../../core/middlewares/validate.middleware.js');
const {
    createProductSchema,
    updateProductSchema,
    productIdParamSchema,
} = require('./product.validator.js');
const {
    protect,
    authorize,
} = require('../../core/middlewares/auth.middleware.js');

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', validate(productIdParamSchema), getProductById);

// Admin Protected Routes
router.post(
    '/',
    protect,
    authorize('ADMIN'),
    validate(createProductSchema),
    createProduct
);
router.patch(
    '/:id',
    protect,
    authorize('ADMIN'),
    validate(updateProductSchema),
    updateProduct
);
router.delete(
    '/:id',
    protect,
    authorize('ADMIN'),
    validate(productIdParamSchema),
    deleteProduct
);

module.exports = router;
