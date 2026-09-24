const Joi = require("joi");

const vehiclesSchema = Joi.object({
    plate_number: Joi.string().required(),
    type: Joi.string().required(),
    capacity: Joi.number().required(),
});

module.exports = {
    vehiclesSchema,
};