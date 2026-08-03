const { z } = require('zod');

const createCommentSchema = z.object({
    body: z.object({
        content: z.string().min(1, 'Comment content is required'),
        author: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid author ID'),
        targetId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid target ID'),
        targetType: z.enum(['Product', 'Post']),
    }),
});

const deleteCommentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid comment ID'),
    }),
});

module.exports = {
    createCommentSchema,
    deleteCommentSchema,
};
