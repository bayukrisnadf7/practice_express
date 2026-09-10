const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller.js");
const validate = require("../utils/validations/validation.js");
const { loginSchema, registerSchema } = require("../middleware/validations/auth.validation.js");

router.post(
    "/register",
    validate(registerSchema),
    AuthController.register
);

router.post(
    "/login",
    validate(loginSchema),
    AuthController.login
);

module.exports = router;