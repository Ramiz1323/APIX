const Order = require('./order.model.js');
const Product = require('../products/product.model.js');
const ApiError = require('../../utils/ApiError.js');

async function getAllOrders(queryParams = {}, currentUser) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Scope orders: regular users can only see their own orders
    if (currentUser.role !== 'ADMIN') {
        filter.customer = currentUser._id;
    } else if (queryParams.customer) {
        filter.customer = queryParams.customer;
    }

    if (queryParams.status) {
        filter.status = queryParams.status;
    }

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .populate('customer', 'name email')
            .populate('orderItems.product', 'name price images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        orders,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
}

async function getOrderById(id, currentUser) {
    const order = await Order.findById(id)
        .populate('customer', 'name email')
        .populate('orderItems.product', 'name price images');

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    if (
        currentUser.role !== 'ADMIN' &&
        order.customer._id.toString() !== currentUser._id.toString()
    ) {
        throw new ApiError(403, 'Not authorized to access this order');
    }

    return order;
}

async function createOrder(orderData, currentUser) {
    const customerId =
        orderData.customer && currentUser.role === 'ADMIN'
            ? orderData.customer
            : currentUser._id;

    let computedTotal = 0;
    const verifiedItems = [];

    // Verify products and stock availability
    for (const item of orderData.orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new ApiError(404, `Product not found with ID: ${item.product}`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${item.quantity}`
            );
        }

        const itemPrice = item.price !== undefined ? item.price : product.price;
        computedTotal += itemPrice * item.quantity;

        // Deduct stock
        product.stock -= item.quantity;
        await product.save();

        verifiedItems.push({
            product: product._id,
            quantity: item.quantity,
            price: itemPrice,
        });
    }

    const finalTotal = orderData.totalAmount !== undefined ? orderData.totalAmount : computedTotal;

    const order = await Order.create({
        customer: customerId,
        orderItems: verifiedItems,
        totalAmount: finalTotal,
        shippingAddress: orderData.shippingAddress,
        status: 'PENDING',
    });

    return await order.populate([
        { path: 'customer', select: 'name email' },
        { path: 'orderItems.product', select: 'name price images' },
    ]);
}

async function updateOrderStatus(id, newStatus, currentUser) {
    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    const isAdmin = currentUser.role === 'ADMIN';
    const isOwner = order.customer.toString() === currentUser._id.toString();

    if (!isAdmin && !isOwner) {
        throw new ApiError(403, 'Not authorized to update this order');
    }

    // Customer permissions: can only CANCEL their own PENDING order
    if (!isAdmin) {
        if (newStatus !== 'CANCELLED' || order.status !== 'PENDING') {
            throw new ApiError(
                400,
                'Customers can only cancel orders that are currently PENDING'
            );
        }
    }

    // If order is getting cancelled and was not cancelled before, restore stock
    if (newStatus === 'CANCELLED' && order.status !== 'CANCELLED') {
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }
    }

    order.status = newStatus;
    await order.save();

    return await order.populate([
        { path: 'customer', select: 'name email' },
        { path: 'orderItems.product', select: 'name price images' },
    ]);
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
};
