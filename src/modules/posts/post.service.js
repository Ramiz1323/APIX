const Post = require('./post.model.js');
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

async function getAllPosts(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Keyword Search
    if (queryParams.search) {
        filter.$or = [
            { title: { $regex: queryParams.search, $options: 'i' } },
            { content: { $regex: queryParams.search, $options: 'i' } },
            { tags: { $in: [new RegExp(queryParams.search, 'i')] } },
        ];
    }

    // Filter by tag
    if (queryParams.tag) {
        filter.tags = queryParams.tag;
    }

    // Filter by author
    if (queryParams.author) {
        filter.author = queryParams.author;
    }

    // Dynamic sorting
    let sortOption = { createdAt: -1 };
    if (queryParams.sort) {
        sortOption = queryParams.sort.split(',').join(' ');
    }

    const [posts, total] = await Promise.all([
        Post.find(filter)
            .populate('author', 'name email avatar')
            .sort(sortOption)
            .skip(skip)
            .limit(limit),
        Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        posts,
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

async function getPostById(id) {
    let post;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        post = await Post.findById(id).populate('author', 'name email avatar');
    } else {
        post = await Post.findOne({ slug: id }).populate('author', 'name email avatar');
    }

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    return post;
}

async function createPost(postData, currentUser) {
    const authorId =
        postData.author && currentUser.role === 'ADMIN'
            ? postData.author
            : currentUser._id;

    const slug = postData.slug
        ? slugify(postData.slug)
        : slugify(postData.title);

    const slugExists = await Post.findOne({ slug });
    if (slugExists) {
        throw new ApiError(400, `Post with slug '${slug}' already exists`);
    }

    const post = await Post.create({
        ...postData,
        slug,
        author: authorId,
    });

    return await post.populate('author', 'name email avatar');
}

async function updatePost(id, updateData, currentUser) {
    const post = await Post.findById(id);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    const isAuthor = post.author.toString() === currentUser._id.toString();
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
        throw new ApiError(403, 'Not authorized to edit this post');
    }

    if (updateData.slug) {
        updateData.slug = slugify(updateData.slug);
        if (updateData.slug !== post.slug) {
            const slugExists = await Post.findOne({ slug: updateData.slug });
            if (slugExists) {
                throw new ApiError(400, `Post slug '${updateData.slug}' is already in use`);
            }
        }
    } else if (updateData.title && !updateData.slug) {
        const newSlug = slugify(updateData.title);
        if (newSlug !== post.slug) {
            const slugExists = await Post.findOne({ slug: newSlug });
            if (!slugExists) {
                updateData.slug = newSlug;
            }
        }
    }

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate('author', 'name email avatar');

    return updatedPost;
}

async function deletePost(id, currentUser) {
    const post = await Post.findById(id);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    const isAuthor = post.author.toString() === currentUser._id.toString();
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
        throw new ApiError(403, 'Not authorized to delete this post');
    }

    await Post.findByIdAndDelete(id);

    return { id, message: 'Post deleted successfully' };
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
