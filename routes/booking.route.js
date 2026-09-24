const express = require("express");
const router = express.Router();

const BookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const validate = require("../utils/validations/validation");
const { createBookingSchema, updateBookingSchema } = require("../middleware/validations/bookings.validation");

// Create booking (Authenticated users)
router.post(
    "/",
    authMiddleware,
    validate(createBookingSchema),
    BookingController.create
);

// Get all bookings (Authenticated users get their own, Admin gets all)
router.get("/", authMiddleware, BookingController.findAll);

// Get booking by id (Owner or Admin)
router.get("/:id", authMiddleware, BookingController.findById);

// Update booking (Owner or Admin)
router.put(
    "/:id",
    authMiddleware,
    validate(updateBookingSchema),
    BookingController.update
);

// Cancel booking (Owner or Admin)
router.patch(
    "/:id/cancel",
    authMiddleware,
    BookingController.cancel
);

// Delete booking (Admin only)
router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    BookingController.delete
);

module.exports = router;
