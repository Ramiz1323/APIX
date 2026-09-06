const User = require('./user.model.js');
const ApiError = require('../../utils/ApiError.js');

async function getAllUsers(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (queryParams.search) {
        filter.$or = [
            { name: { $regex: queryParams.search, $options: 'i' } },
            { email: { $regex: queryParams.search, $options: 'i' } },
        ];
    }

    if (queryParams.role) {
        filter.role = queryParams.role;
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        users,
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

async function getUserById(id) {
    const user = await User.findById(id).select('-password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
}

async function updateUser(id, updateData, requester) {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Permission check: only admin or self can update
    const isSelf = requester && requester._id.toString() === id.toString();
    const isAdmin = requester && requester.role === 'ADMIN';

    if (!isSelf && !isAdmin) {
        throw new ApiError(403, 'Not authorized to update this user profile');
    }

    // Non-admins cannot elevate or change roles
    if (updateData.role && !isAdmin) {
        delete updateData.role;
    }

    // Check if new email is already taken by another user
    if (updateData.email && updateData.email !== user.email) {
        const emailExists = await User.findOne({ email: updateData.email });
        if (emailExists) {
            throw new ApiError(400, 'Email already in use');
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select('-password');

    return updatedUser;
}

async function deleteUser(id) {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    await User.findByIdAndDelete(id);

    return { id, message: 'User deleted successfully' };
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
