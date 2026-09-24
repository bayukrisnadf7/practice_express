const Joi = require("joi");

const createBookingSchema = Joi.object({
    schedule_id: Joi.string().required().messages({
        "any.required": "schedule_id is required",
    }),
    seat_number: Joi.number().integer().min(1).required().messages({
        "any.required": "seat_number is required",
        "number.base": "seat_number must be a number",
        "number.min": "seat_number must be at least 1",
    }),
    user_id: Joi.string().optional(),
    booking_status: Joi.string().valid("booked", "paid", "cancelled", "completed").default("booked"),
    total_penumpang: Joi.number().optional().allow(null),
    total_harga: Joi.number().optional().allow(null),
    status: Joi.string().optional().allow(null),
});

const updateBookingSchema = Joi.object({
    seat_number: Joi.number().integer().min(1).optional(),
    booking_status: Joi.string().valid("booked", "paid", "cancelled", "completed").optional(),
}).min(1);

module.exports = {
    createBookingSchema,
    updateBookingSchema,
};