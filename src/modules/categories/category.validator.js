const { z } = require('zod');

const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Category name is required'),
        slug: z.string().min(1, 'Slug is required'),
        description: z.string().optional(),
    }),
});

const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Category name cannot be empty').optional(),
        slug: z.string().min(1, 'Slug cannot be empty').optional(),
        description: z.string().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    }),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
