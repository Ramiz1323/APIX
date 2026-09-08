const Category = require('./category.model.js');
const ApiError = require('../../utils/ApiError.js');

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

async function getAllCategories(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (queryParams.search) {
        filter.$or = [
            { name: { $regex: queryParams.search, $options: 'i' } },
            { description: { $regex: queryParams.search, $options: 'i' } },
        ];
    }

    const [categories, total] = await Promise.all([
        Category.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit),
        Category.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        categories,
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

async function getCategoryById(id) {
    let category;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        category = await Category.findById(id);
    } else {
        category = await Category.findOne({ slug: id });
    }

    if (!category) {
        throw new ApiError(404, 'Category not found');
    }
    return category;
}

async function createCategory(categoryData) {
    const slug = categoryData.slug
        ? slugify(categoryData.slug)
        : slugify(categoryData.name);

    const existingCategory = await Category.findOne({
        $or: [{ name: categoryData.name }, { slug }],
    });

    if (existingCategory) {
        throw new ApiError(400, 'Category with this name or slug already exists');
    }

    const category = await Category.create({
        ...categoryData,
        slug,
    });

    return category;
}

async function updateCategory(id, updateData) {
    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    if (updateData.name && !updateData.slug) {
        updateData.slug = slugify(updateData.name);
    } else if (updateData.slug) {
        updateData.slug = slugify(updateData.slug);
    }

    if (updateData.name || updateData.slug) {
        const conflict = await Category.findOne({
            _id: { $ne: id },
            $or: [
                ...(updateData.name ? [{ name: updateData.name }] : []),
                ...(updateData.slug ? [{ slug: updateData.slug }] : []),
            ],
        });

        if (conflict) {
            throw new ApiError(400, 'Category name or slug already taken');
        }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedCategory;
}

async function deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    await Category.findByIdAndDelete(id);

    return { id, message: 'Category deleted successfully' };
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
