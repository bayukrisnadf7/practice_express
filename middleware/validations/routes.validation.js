const Joi = require("joi");

const createRouteSchema = Joi.object({
    origin: Joi.string().trim().required().messages({
        "any.required": "Origin is required",
        "string.empty": "Origin cannot be empty",
    }),
    destination: Joi.string().trim().required().messages({
        "any.required": "Destination is required",
        "string.empty": "Destination cannot be empty",
    }),
    distance: Joi.number().positive().required().messages({
        "any.required": "Distance is required",
        "number.base": "Distance must be a number",
        "number.positive": "Distance must be greater than 0",
    }),
});

const updateRouteSchema = Joi.object({
    origin: Joi.string().trim().optional(),
    destination: Joi.string().trim().optional(),
    distance: Joi.number().positive().optional(),
}).min(1);

module.exports = {
    createRouteSchema,
    updateRouteSchema,
};