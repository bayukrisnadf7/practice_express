const PaymentService = require("../services/payment.service");
const { successResponse, errorResponse } = require("../utils/response/response");

class PaymentController {
    static async create(req, res) {
        try {
            const payment = await PaymentService.create(req.body, req.user);
            return successResponse(res, payment, "Success process payment", 201);
        } catch (error) {
            let statusCode = 500;
            if (error.message.includes("not found")) statusCode = 404;
            else if (error.message.includes("permission")) statusCode = 403;
            else if (error.message.includes("already paid") || error.message.includes("cancelled")) statusCode = 400;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async findAll(req, res) {
        try {
            const page = req.query.page ? Number(req.query.page) : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;

            const payments = await PaymentService.findAll(page, limit);
            return successResponse(res, payments, "Success get all payments");
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    }

    static async findById(req, res) {
        try {
            const payment = await PaymentService.findById(req.params.id, req.user);
            return successResponse(res, payment, "Success get payment by id");
        } catch (error) {
            let statusCode = 500;
            if (error.message.includes("not found")) statusCode = 404;
            else if (error.message.includes("permission")) statusCode = 403;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async findByBookingId(req, res) {
        try {
            const payments = await PaymentService.findByBookingId(req.params.booking_id, req.user);
            return successResponse(res, payments, "Success get payments for booking");
        } catch (error) {
            let statusCode = 500;
            if (error.message.includes("not found")) statusCode = 404;
            else if (error.message.includes("permission")) statusCode = 403;
            return errorResponse(res, error.message, statusCode);
        }
    }
}

module.exports = PaymentController;
