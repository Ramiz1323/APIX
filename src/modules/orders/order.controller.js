const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const orderService = require('./order.service.js');

const getAllOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getAllOrders(req.query, req.user);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Orders retrieved successfully'));
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id, req.user);
    res
        .status(200)
        .json(new ApiResponse(200, order, 'Order retrieved successfully'));
});

const createOrder = asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.body, req.user);
    res
        .status(201)
        .json(new ApiResponse(201, order, 'Order placed successfully'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const updatedOrder = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status,
        req.user
    );
    res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, 'Order status updated successfully'));
});

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
};
