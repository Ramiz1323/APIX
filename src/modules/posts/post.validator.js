const { z } = require('zod');

const createPostSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        slug: z.string().min(1, 'Slug cannot be empty').optional(),
        content: z.string().min(1, 'Content is required'),
        coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
        author: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid author ID').optional(),
        tags: z.array(z.string()).optional(),
    }),
});

const updatePostSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title cannot be empty').optional(),
        slug: z.string().min(1, 'Slug cannot be empty').optional(),
        content: z.string().min(1, 'Content cannot be empty').optional(),
        coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
        tags: z.array(z.string()).optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'),
    }),
});

const postIdParamSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'),
    }),
});

module.exports = {
    createPostSchema,
    updatePostSchema,
    postIdParamSchema,
};
