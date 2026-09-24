const BookingService = require("../services/booking.service");
const { successResponse, errorResponse } = require("../utils/response/response");

class BookingController {
    static async create(req, res) {
        try {
            const booking = await BookingService.create(req.body, req.user);
            return successResponse(res, booking, "Success add booking", 201);
        } catch (error) {
            let statusCode = 500;
            if (error.message.includes("not found")) statusCode = 404;
            else if (error.message.includes("already booked") || error.message.includes("capacity") || error.message.includes("not active")) {
                statusCode = 400;
            }
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async findAll(req, res) {
        try {
            const page = req.query.page ? Number(req.query.page) : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;
            const filter = {
                user_id: req.query.user_id,
                schedule_id: req.query.schedule_id,
                booking_status: req.query.booking_status,
            };

            const bookings = await BookingService.findAll(page, limit, filter, req.user);
            return successResponse(res, bookings, "Success get all bookings");
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    }

    static async findById(req, res) {
        try {
            const booking = await BookingService.findById(req.params.id, req.user);
            return successResponse(res, booking, "Success get booking by id");
        } catch (error) {
            let statusCode = 500;
            if (error.message === "Booking not found") statusCode = 404;
            else if (error.message.includes("permission")) statusCode = 403;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async update(req, res) {
        try {
            const booking = await BookingService.update(req.params.id, req.body, req.user);
            return successResponse(res, booking, "Success update booking");
        } catch (error) {
            let statusCode = 500;
            if (error.message === "Booking not found") statusCode = 404;
            else if (error.message.includes("permission")) statusCode = 403;
            else if (error.message.includes("already booked") || error.message.includes("capacity")) statusCode = 400;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async cancel(req, res) {
        try {
            const booking = await BookingService.cancel(req.params.id, req.user);
            return successResponse(res, booking, "Success cancel booking");
        } catch (error) {
            let statusCode = 500;
            if (error.message === "Booking not found") statusCode = 404;
            else if (error.message.includes("permission")) statusCode = 403;
            else if (error.message.includes("already cancelled")) statusCode = 400;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async delete(req, res) {
        try {
            const booking = await BookingService.delete(req.params.id);
            return successResponse(res, booking, "Success delete booking");
        } catch (error) {
            const statusCode = error.message === "Booking not found" ? 404 : 500;
            return errorResponse(res, error.message, statusCode);
        }
    }
}

module.exports = BookingController;
