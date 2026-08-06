const jwt = require("jsonwebtoken");
const User = require("../../modules/users/user.model.js");

async function protect(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authorized, user not found" });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};

function authorize(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};

function admin(req, res, next) {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Acsess denied: Admin privileges required",
        });
    }
};

module.exports = { protect, authorize, admin };