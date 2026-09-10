const Joi = require("joi");

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const registerSchema = Joi.object({
    nama: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    no_hp: Joi.string().required(),
    jenis_kelamin: Joi.string().required(),
    role: Joi.string().required(),
});

module.exports = {
    loginSchema,
    registerSchema
};