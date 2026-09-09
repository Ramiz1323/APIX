const router = require('express').Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
} = require('./order.controller.js');
const { validate } = require('../../core/middlewares/validate.middleware.js');
const {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdParamSchema,
} = require('./order.validator.js');
const { protect } = require('../../core/middlewares/auth.middleware.js');

// All order routes are protected by authentication
router.use(protect);

router.get('/', getAllOrders);
router.get('/:id', validate(orderIdParamSchema), getOrderById);
router.post('/', validate(createOrderSchema), createOrder);
router.patch('/:id', validate(updateOrderStatusSchema), updateOrderStatus);

module.exports = router;
