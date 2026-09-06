const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('./user.controller.js');
const { validate } = require('../../core/middlewares/validate.middleware.js');
const {
    updateUserSchema,
    userIdParamSchema,
} = require('./user.validator.js');
const {
    protect,
    authorize,
} = require('../../core/middlewares/auth.middleware.js');

// Routes
router.get('/', protect, getAllUsers);
router.get('/:id', protect, validate(userIdParamSchema), getUserById);
router.patch('/:id', protect, validate(updateUserSchema), updateUser);
router.delete(
    '/:id',
    protect,
    authorize('ADMIN'),
    validate(userIdParamSchema),
    deleteUser
);

module.exports = router;
