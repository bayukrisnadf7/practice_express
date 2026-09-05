const Joi = require("joi");

const createUserSchema = Joi.object({
    nama: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    no_hp: Joi.string().required(),
    jenis_kelamin: Joi.string().required(),
    role: Joi.string().required(),
});

module.exports = {
    createUserSchema,
};