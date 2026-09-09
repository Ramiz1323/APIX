const Comment = require('./comment.model.js');
const Product = require('../products/product.model.js');
const Post = require('../posts/post.model.js');
const ApiError = require('../../utils/ApiError.js');

async function getAllComments(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (queryParams.targetId) {
        filter.targetId = queryParams.targetId;
    }

    if (queryParams.targetType) {
        filter.targetType = queryParams.targetType;
    }

    if (queryParams.author) {
        filter.author = queryParams.author;
    }

    const [comments, total] = await Promise.all([
        Comment.find(filter)
            .populate('author', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Comment.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        comments,
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

async function getCommentById(id) {
    const comment = await Comment.findById(id).populate('author', 'name email avatar');
    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }
    return comment;
}

async function createComment(commentData, currentUser) {
    const authorId =
        commentData.author && currentUser.role === 'ADMIN'
            ? commentData.author
            : currentUser._id;

    // Validate polymorphic target existence
    if (commentData.targetType === 'Product') {
        const product = await Product.findById(commentData.targetId);
        if (!product) {
            throw new ApiError(404, 'Product target not found');
        }
    } else if (commentData.targetType === 'Post') {
        const post = await Post.findById(commentData.targetId);
        if (!post) {
            throw new ApiError(404, 'Post target not found');
        }
    } else {
        throw new ApiError(400, 'Invalid target type. Must be Product or Post');
    }

    const comment = await Comment.create({
        ...commentData,
        author: authorId,
    });

    return await comment.populate('author', 'name email avatar');
}

async function deleteComment(id, currentUser) {
    const comment = await Comment.findById(id);
    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }

    const isAuthor = comment.author.toString() === currentUser._id.toString();
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
        throw new ApiError(403, 'Not authorized to delete this comment');
    }

    await Comment.findByIdAndDelete(id);

    return { id, message: 'Comment deleted successfully' };
}

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    deleteComment,
};
