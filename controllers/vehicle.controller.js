const VehicleService = require("../services/vehicle.service.js");
const { successResponse, errorResponse } = require("../utils/response/response.js");

class VehicleController {
    static async create(req, res) {
        try {
            const vehicle = await VehicleService.create(req.body);

            return successResponse(
                res,
                vehicle,
                "Success add vehicle"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "Vehicle already exists" ? 400 : 500
            );
        }
    }

    static async findByPlateNumber(req, res) {
        try {
            const vehicle = await VehicleService.findByPlateNumber(req.params.plate_number);

            return successResponse(
                res,
                vehicle,
                "Success find vehicle by plate number"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "Vehicle not found" ? 404 : 500
            );
        }
    }

    static async findAll(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const vehicles = await VehicleService.findAll(page, limit);

            return successResponse(
                res,
                vehicles,
                "Success find all vehicle"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "Vehicle not found" ? 404 : 500
            );
        }
    }

    static async update(req, res) {
        try {
            const vehicle = await VehicleService.update(req.params.id, req.body);

            return successResponse(
                res,
                vehicle,
                "Success update vehicle"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "Vehicle not found" ? 404 : 500
            );
        }
    }

    static async delete(req, res) {
        try {
            const vehicle = await VehicleService.delete(req.params.id);

            return successResponse(
                res,
                vehicle,
                "Success delete vehicle"
            );
        } catch (error) {
            return errorResponse(
                res,
                error.message,
                error.message === "Vehicle not found" ? 404 : 500
            );
        }
    }
}

module.exports = VehicleController;