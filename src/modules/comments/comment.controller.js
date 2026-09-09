const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const commentService = require('./comment.service.js');

const getAllComments = asyncHandler(async (req, res) => {
    const result = await commentService.getAllComments(req.query);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Comments retrieved successfully'));
});

const getCommentById = asyncHandler(async (req, res) => {
    const comment = await commentService.getCommentById(req.params.id);
    res
        .status(200)
        .json(new ApiResponse(200, comment, 'Comment retrieved successfully'));
});

const createComment = asyncHandler(async (req, res) => {
    const comment = await commentService.createComment(req.body, req.user);
    res
        .status(201)
        .json(new ApiResponse(201, comment, 'Comment posted successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
    const result = await commentService.deleteComment(req.params.id, req.user);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Comment deleted successfully'));
});

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    deleteComment,
};
