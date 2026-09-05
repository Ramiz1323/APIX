const asyncHandler = require("../../utils/asyncHandler.js");
const ApiResponse = require("../../utils/ApiResponse.js");
const authService = require("./auth.service.js");

// Common cookie options
const COOKIE_OPTIONS = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Needed for cross-domain cookies
};

// Send token with cookie and standardized ApiResponse
const sendTokenResponse = (user, statusCode, message, res) => {
    const token = user.token;

    res
        .status(statusCode)
        .cookie('token', token, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                statusCode,
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    token: user.token,
                },
                message
            )
        );
};

const register = asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body);
    sendTokenResponse(result, 201, 'User registered successfully', res);
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendTokenResponse(result, 200, 'User logged in successfully', res);
});

const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user._id);
    res
        .status(200)
        .json(new ApiResponse(200, user, 'User profile fetched successfully'));
});

const logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
        ...COOKIE_OPTIONS,
        expires: new Date(Date.now() + 10 * 1000), // Expire in 10s
    });

    res
        .status(200)
        .json(new ApiResponse(200, null, 'User logged out successfully'));
});

module.exports = {
    register,
    login,
    getMe,
    logout,
};