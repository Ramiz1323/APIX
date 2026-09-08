const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const categoryService = require('./category.service.js');

const getAllCategories = asyncHandler(async (req, res) => {
    const result = await categoryService.getAllCategories(req.query);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Categories retrieved successfully'));
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res
        .status(200)
        .json(new ApiResponse(200, category, 'Category retrieved successfully'));
});

const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res
        .status(201)
        .json(new ApiResponse(201, category, 'Category created successfully'));
});

const updateCategory = asyncHandler(async (req, res) => {
    const updatedCategory = await categoryService.updateCategory(
        req.params.id,
        req.body
    );
    res
        .status(200)
        .json(
            new ApiResponse(200, updatedCategory, 'Category updated successfully')
        );
});

const deleteCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.deleteCategory(req.params.id);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Category deleted successfully'));
});

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
