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
}

module.exports = AuthController;