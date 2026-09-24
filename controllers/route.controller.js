const RouteService = require("../services/route.service");
const { successResponse, errorResponse } = require("../utils/response/response");

class RouteController {
    static async create(req, res) {
        try {
            const route = await RouteService.create(req.body);
            return successResponse(res, route, "Success add route", 201);
        } catch (error) {
            const statusCode = error.message.includes("already exists") ? 400 : 500;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async findAll(req, res) {
        try {
            const page = req.query.page ? Number(req.query.page) : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;

            const routes = await RouteService.findAll(page, limit);
            return successResponse(res, routes, "Success get all routes");
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    }

    static async findById(req, res) {
        try {
            const route = await RouteService.findById(req.params.id);
            return successResponse(res, route, "Success get route by id");
        } catch (error) {
            const statusCode = error.message === "Route not found" ? 404 : 500;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async update(req, res) {
        try {
            const route = await RouteService.update(req.params.id, req.body);
            return successResponse(res, route, "Success update route");
        } catch (error) {
            let statusCode = 500;
            if (error.message === "Route not found") statusCode = 404;
            else if (error.message.includes("already exists")) statusCode = 400;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async delete(req, res) {
        try {
            const route = await RouteService.delete(req.params.id);
            return successResponse(res, route, "Success delete route");
        } catch (error) {
            const statusCode = error.message === "Route not found" ? 404 : 500;
            return errorResponse(res, error.message, statusCode);
        }
    }
}

module.exports = RouteController;
