const { z } = require('zod');

const orderItemSchema = z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price cannot be negative'),
});

const createOrderSchema = z.object({
    body: z.object({
        customer: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid customer ID'),
        orderItems: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
        totalAmount: z.number().min(0, 'Total amount cannot be negative'),
        shippingAddress: z.string().min(5, 'Shipping address is too short'),
    }),
});

const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
    }),
});

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema,
};
