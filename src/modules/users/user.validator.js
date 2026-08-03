const { z } = require('zod');

const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        role: z.enum(['USER', 'ADMIN']).optional(),
        avatar: z.string().url('Invalid avatar URL').optional(),
    }),
});

const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name cannot be empty').optional(),
        email: z.string().email('Invalid email address').optional(),
        role: z.enum(['USER', 'ADMIN']).optional(),
        avatar: z.string().url('Invalid avatar URL').optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
});

module.exports = {
    createUserSchema,
    updateUserSchema,
};
