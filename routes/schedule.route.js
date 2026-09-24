const express = require("express");
const router = express.Router();

const ScheduleController = require("../controllers/schedule.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const validate = require("../utils/validations/validation");
const { createScheduleSchema, updateScheduleSchema } = require("../middleware/validations/schedule.validation");

// Create schedule (Admin only)
router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    validate(createScheduleSchema),
    ScheduleController.create
);

// Get all schedules (Authenticated)
router.get("/", authMiddleware, ScheduleController.findAll);

// Get schedule by id (Authenticated)
router.get("/:id", authMiddleware, ScheduleController.findById);

// Update schedule (Admin only)
router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),
    validate(updateScheduleSchema),
    ScheduleController.update
);

// Delete schedule (Admin only)
router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    ScheduleController.delete
);

module.exports = router;
