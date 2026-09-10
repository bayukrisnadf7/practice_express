const UserService = require("../services/user.service.js");
const { successResponse, errorResponse } = require("../utils/response/response.js");

class UserController {
    static async findAll(req, res) {
        try {
            const users = await UserService.findAll();

            return successResponse(
                res,
                users,
                "Data user berhasil diambil"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message
            );
        }
    }

    static async findById(req, res) {
        try {
            const user = await UserService.findById(req.params.id);

            return successResponse(
                res,
                user,
                "Data user ditemukan"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "User tidak ditemukan" ? 404 : 500
            );
        }
    }

    static async update(req, res) {
        try {
            const user = await UserService.update(req.params.id, req.body);

            return successResponse(
                res,
                user,
                "User berhasil diperbarui"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "User tidak ditemukan" ? 404 : 500
            );
        }
    }

    static async delete(req, res) {
        try {
            const user = await UserService.delete(req.params.id);

            return successResponse(
                res,
                user,
                "User berhasil dihapus"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "User tidak ditemukan" ? 404 : 500
            );
        }
    }
}

module.exports = UserController;