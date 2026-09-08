const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller.js");
const validate = require("../utils/validations/validation.js");
const { loginSchema } = require("../middleware/validations/auth.validation.js");


router.post(
    "/login",
    validate(loginSchema),
    AuthController.login
);

module.exports = router;