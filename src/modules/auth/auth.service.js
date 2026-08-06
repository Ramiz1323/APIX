const jwt = require("jsonwebtoken");
const User = require("../users/user.model.js");
const ApiError = require("../../utils/ApiError.js");


const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ userId: id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

async function registerUser(userData) {
    const { name, email, password, role, avatar } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, "User already exists");
    }

    let user;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            user = await User.create({ name, email, password, role, avatar });
            break;
        } catch (error) {
            throw error;
        }
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id, user.role),
    };
};

async function loginUser(email, password) {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        throw new ApiError('Invalid email or password', 401);
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id, user.role),
    };
}

module.exports = {
    registerUser,
    loginUser,
};