const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const postService = require('./post.service.js');

const getAllPosts = asyncHandler(async (req, res) => {
    const result = await postService.getAllPosts(req.query);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Posts retrieved successfully'));
});

const getPostById = asyncHandler(async (req, res) => {
    const post = await postService.getPostById(req.params.id);
    res
        .status(200)
        .json(new ApiResponse(200, post, 'Post retrieved successfully'));
});

const createPost = asyncHandler(async (req, res) => {
    const post = await postService.createPost(req.body, req.user);
    res
        .status(201)
        .json(new ApiResponse(201, post, 'Post created successfully'));
});

const updatePost = asyncHandler(async (req, res) => {
    const updatedPost = await postService.updatePost(
        req.params.id,
        req.body,
        req.user
    );
    res
        .status(200)
        .json(new ApiResponse(200, updatedPost, 'Post updated successfully'));
});

const deletePost = asyncHandler(async (req, res) => {
    const result = await postService.deletePost(req.params.id, req.user);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Post deleted successfully'));
});

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
