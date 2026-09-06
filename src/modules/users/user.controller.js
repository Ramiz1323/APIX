const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const userService = require('./user.service.js');

const getAllUsers = asyncHandler(async (req, res) => {
    const result = await userService.getAllUsers(req.query);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Users retrieved successfully'));
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res
        .status(200)
        .json(new ApiResponse(200, user, 'User retrieved successfully'));
});

const updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateUser(
        req.params.id,
        req.body,
        req.user
    );
    res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'User updated successfully'));
});

const deleteUser = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'User deleted successfully'));
});

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
