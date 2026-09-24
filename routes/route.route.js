const express = require("express");
const router = express.Router();

const RouteController = require("../controllers/route.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const validate = require("../utils/validations/validation");
const { createRouteSchema, updateRouteSchema } = require("../middleware/validations/routes.validation");

// Create route (Admin only)
router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    validate(createRouteSchema),
    RouteController.create
);

// Get all routes (Authenticated)
router.get("/", authMiddleware, RouteController.findAll);

// Get route by id (Authenticated)
router.get("/:id", authMiddleware, RouteController.findById);

// Update route (Admin only)
router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),
    validate(updateRouteSchema),
    RouteController.update
);

// Delete route (Admin only)
router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    RouteController.delete
);

module.exports = router;
