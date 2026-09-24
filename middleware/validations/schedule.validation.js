const Joi = require("joi");

const createScheduleSchema = Joi.object({
    route_id: Joi.string().required().messages({
        "any.required": "route_id is required",
    }),
    vehicle_id: Joi.string().required().messages({
        "any.required": "vehicle_id is required",
    }),
    departure_at: Joi.date().iso().required().messages({
        "any.required": "departure_at is required (ISO 8601 format, e.g. 2026-10-01T08:00:00Z)",
    }),
    arrival_at: Joi.date().iso().greater(Joi.ref("departure_at")).required().messages({
        "any.required": "arrival_at is required (ISO 8601 format, e.g. 2026-10-01T12:00:00Z)",
        "date.greater": "arrival_at must be later than departure_at",
    }),
    status: Joi.string().valid("active", "inactive", "cancelled", "completed").default("active"),
    price: Joi.number().optional().allow(null),
    quota: Joi.number().optional().allow(null),
});

const updateScheduleSchema = Joi.object({
    route_id: Joi.string().optional(),
    vehicle_id: Joi.string().optional(),
    departure_at: Joi.date().iso().optional(),
    arrival_at: Joi.date().iso().optional(),
    status: Joi.string().valid("active", "inactive", "cancelled", "completed").optional(),
    price: Joi.number().optional().allow(null),
    quota: Joi.number().optional().allow(null),
}).min(1);

module.exports = {
    createScheduleSchema,
    updateScheduleSchema,
};