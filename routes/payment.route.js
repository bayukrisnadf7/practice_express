const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const validate = require("../utils/validations/validation");
const { createPaymentSchema } = require("../middleware/validations/payment.validation");

// Create payment (Authenticated user)
router.post(
    "/",
    authMiddleware,
    validate(createPaymentSchema),
    PaymentController.create
);

// Get all payments (Admin only)
router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    PaymentController.findAll
);

// Get payments by booking id (Owner or Admin)
router.get(
    "/booking/:booking_id",
    authMiddleware,
    PaymentController.findByBookingId
);

// Get payment by id (Owner or Admin)
router.get(
    "/:id",
    authMiddleware,
    PaymentController.findById
);

module.exports = router;
