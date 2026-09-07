const Product = require('./product.model.js');
const ApiError = require('../../utils/ApiError.js');

// Helper to generate URL-safe slugs
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

async function getAllProducts(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Search by name or description
    if (queryParams.search) {
        filter.$or = [
            { name: { $regex: queryParams.search, $options: 'i' } },
            { description: { $regex: queryParams.search, $options: 'i' } },
        ];
    }

    // Filter by Category
    if (queryParams.category) {
        filter.category = queryParams.category;
    }

    // Filter by Price range
    if (queryParams.minPrice !== undefined || queryParams.maxPrice !== undefined) {
        filter.price = {};
        if (queryParams.minPrice !== undefined) {
            filter.price.$gte = Number(queryParams.minPrice);
        }
        if (queryParams.maxPrice !== undefined) {
            filter.price.$lte = Number(queryParams.maxPrice);
        }
    }

    // Filter by In-Stock
    if (queryParams.inStock === 'true' || queryParams.inStock === true) {
        filter.stock = { $gt: 0 };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (queryParams.sort) {
        const sortFields = queryParams.sort.split(',').join(' ');
        sortOption = sortFields;
    }

    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate('category', 'name slug')
            .sort(sortOption)
            .skip(skip)
            .limit(limit),
        Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        products,
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

async function getProductById(id) {
    const product = await Product.findById(id).populate('category', 'name slug');
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    return product;
}

async function createProduct(productData) {
    const slug = productData.slug
        ? slugify(productData.slug)
        : slugify(productData.name);

    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
        throw new ApiError(400, `Product slug '${slug}' already exists`);
    }

    const product = await Product.create({
        ...productData,
        slug,
    });

    return await product.populate('category', 'name slug');
}

async function updateProduct(id, updateData) {
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    if (updateData.slug) {
        updateData.slug = slugify(updateData.slug);
        if (updateData.slug !== product.slug) {
            const slugExists = await Product.findOne({ slug: updateData.slug });
            if (slugExists) {
                throw new ApiError(400, `Product slug '${updateData.slug}' already exists`);
            }
        }
    } else if (updateData.name && !updateData.slug) {
        // Update slug if name changes and no explicit slug is passed
        const newSlug = slugify(updateData.name);
        if (newSlug !== product.slug) {
            const slugExists = await Product.findOne({ slug: newSlug });
            if (!slugExists) {
                updateData.slug = newSlug;
            }
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate('category', 'name slug');

    return updatedProduct;
}

async function deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    await Product.findByIdAndDelete(id);

    return { id, message: 'Product deleted successfully' };
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
