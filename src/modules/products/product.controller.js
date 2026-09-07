const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const productService = require('./product.service.js');

const getAllProducts = asyncHandler(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Products retrieved successfully'));
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res
        .status(200)
        .json(new ApiResponse(200, product, 'Product retrieved successfully'));
});

const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res
        .status(201)
        .json(new ApiResponse(201, product, 'Product created successfully'));
});

const updateProduct = asyncHandler(async (req, res) => {
    const updatedProduct = await productService.updateProduct(
        req.params.id,
        req.body
    );
    res
        .status(200)
        .json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    res
        .status(200)
        .json(new ApiResponse(200, result, 'Product deleted successfully'));
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
