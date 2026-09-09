const router = require("express").Router();
const { register, login, logout } = require("./auth.controller.js");
const { validate } = require("../../core/middlewares/validate.middleware.js");
const { registerSchema, loginSchema } = require("./auth.validator.js");
const { protect } = require("../../core/middlewares/auth.middleware.js");


router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", protect, logout);

module.exports = router;