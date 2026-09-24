const crypto = require("crypto");
const PaymentRepository = require("../repositories/payment.repositories");
const BookingRepository = require("../repositories/booking.repositories");

class PaymentService {
    static async create(data, user) {
        const booking = await BookingRepository.findById(data.booking_id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        if (user.role !== "admin" && booking.user_id !== user.user_id) {
            throw new Error("You do not have permission to pay for this booking");
        }

        if (booking.booking_status === "cancelled") {
            throw new Error("Cannot pay for a cancelled booking");
        }

        if (booking.booking_status === "paid") {
            throw new Error("Booking is already paid");
        }

        const transactionId = data.transaction_id || `TRX-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

        const payment = await PaymentRepository.create({
            ...data,
            transaction_id: transactionId,
        });

        // Update booking status to "paid"
        await BookingRepository.update(data.booking_id, {
            booking_status: "paid",
        });

        return payment;
    }

    static async findAll(page, limit) {
        return await PaymentRepository.findAll(page, limit);
    }

    static async findById(id, user) {
        const payment = await PaymentRepository.findById(id);
        if (!payment) {
            throw new Error("Payment not found");
        }

        if (user.role !== "admin" && payment.booking?.user_id !== user.user_id) {
            throw new Error("You do not have permission to view this payment");
        }

        return payment;
    }

    static async findByBookingId(booking_id, user) {
        const booking = await BookingRepository.findById(booking_id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        if (user.role !== "admin" && booking.user_id !== user.user_id) {
            throw new Error("You do not have permission to view this payment");
        }

        return await PaymentRepository.findByBookingId(booking_id);
    }
}

module.exports = PaymentService;
