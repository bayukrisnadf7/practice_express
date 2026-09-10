const AuthService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response/response");

class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const result = await AuthService.login(email, password);

            return successResponse(
                res,
                result,
                "Login berhasil",
                200
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "Email atau password salah" ? 401 : 500
            );
        }
    }

    static async register(req, res) {
        try {
            const result = await AuthService.register(req.body);

            return successResponse(
                res,
                result,
                "Registrasi berhasil",
                201
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "Email sudah digunakan" ? 400 : 500
            );
        }
    }
}

module.exports = AuthController;