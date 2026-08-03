const { z } = require('zod');

const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Product name is required'),
        slug: z.string().min(1, 'Slug is required'),
        description: z.string().min(1, 'Product description is required'),
        price: z.number().min(0, 'Price cannot be negative'),
        stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
        category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
        images: z.array(z.string().url('Invalid image URL')).optional(),
    }),
});

const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Product name cannot be empty').optional(),
        slug: z.string().min(1, 'Slug cannot be empty').optional(),
        description: z.string().min(1, 'Product description cannot be empty').optional(),
        price: z.number().min(0, 'Price cannot be negative').optional(),
        stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
        category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID').optional(),
        images: z.array(z.string().url('Invalid image URL')).optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    }),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
};
