const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const validate = require("../utils/validations/validation.js");
const { createUserSchema } = require("../middleware/validations/user.validation.js");

router.post(
    "/",
    validate(createUserSchema),
    UserController.create
);

router.get(
    "/",
    UserController.findAll
);

router.get(
    "/:id",
    UserController.findById
);

router.put(
    "/:id",
    UserController.update
);

router.delete(
    "/:id",
    UserController.delete
);

module.exports = router;