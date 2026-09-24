const Joi = require("joi");

const createPaymentSchema = Joi.object({
    booking_id: Joi.string().required().messages({
        "any.required": "booking_id is required",
    }),
    payment_method: Joi.string().trim().required().messages({
        "any.required": "payment_method is required (e.g. transfer_bank, e_wallet, credit_card, cash)",
    }),
    amount: Joi.number().positive().required().messages({
        "any.required": "amount is required",
        "number.positive": "amount must be greater than 0",
    }),
    transaction_id: Joi.string().optional(),
});

module.exports = {
    createPaymentSchema,
};
