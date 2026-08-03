const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1'],
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    },
});

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Customer reference is required'],
        },
        orderItems: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            type: String,
            required: [true, 'Shipping address is required'],
        },
        status: {
            type: String,
            enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            default: 'PENDING',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
